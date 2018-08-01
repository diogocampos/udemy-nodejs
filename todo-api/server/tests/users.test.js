const { objectContaining, stringMatching } = expect
const { pick } = require('lodash')
const request = require('supertest')

const app = require('../app')
const User = require('../db/User')
const fixtures = require('./fixtures')
const { pojo, requiresAuthentication } = require('./helpers')

const OBJECT_ID = /^[0-9a-f]{24}$/
const BCRYPT_HASH = /^\$2a\$10\$.{53}$/
const JSON_WEB_TOKEN = /^eyJ/

beforeEach(fixtures.users.populate)

/*
  ####    ###    ####  #####
  #   #  #   #  #        #
  ####   #   #   ###     #
  #      #   #      #    #
  #       ###   ####     #
*/

describe('POST /users', () => {
  const req = body =>
    request(app)
      .post('/users')
      .send(body)

  describe('with valid data', () => {
    let email, res
    beforeEach(async () => {
      email = `${Date.now()}@example.com`
      res = await req({ email, password: 'newUserPass' }).expect(200)
    })

    it('creates a new user with hashed password and auth token', async () => {
      const userDoc = await User.findOne({ email })
      expect(pojo(userDoc)).toMatchObject({
        _id: res.body.user._id,
        password: stringMatching(BCRYPT_HASH),
        tokens: [
          objectContaining({
            access: 'auth',
            token: stringMatching(JSON_WEB_TOKEN),
          }),
        ],
      })
    })

    it('returns the new user with auth token in header', () => {
      expect(res.headers['x-auth']).toMatch(JSON_WEB_TOKEN)
      expect(res.body.user).toEqual({
        _id: stringMatching(OBJECT_ID),
        email,
      })
    })
  })

  describe('validation', () => {
    afterEach(async () => {
      // check that a new user has not been created
      const users = await User.find()
      expect(users).toHaveLength(fixtures.users.length)
    })

    it('checks if email is invalid', async () => {
      const body = { email: 'foo', password: '12345678' }
      const res = await req(body).expect(400)
      expect(res.body.errors.email).toBeDefined()
    })

    it('checks if password is too short', async () => {
      const body = { email: 'foo@bar.com', password: '12345' }
      const res = await req(body).expect(400)
      expect(res.body.errors.password).toBeDefined()
    })

    it('checks if email is already in use', async () => {
      const body = { email: fixtures.users[0].email, password: '12345678' }
      await req(body).expect(400, 'Bad Request')
    })
  })
})

describe('POST /users/login', () => {
  const req = body =>
    request(app)
      .post('/users/login')
      .send(body)

  describe('with valid credentials', () => {
    let user, res
    beforeEach(async () => {
      user = fixtures.users[0]
      const body = pick(user, 'email', 'password')
      res = await req(body).expect(200)
    })

    it('generates and stores a new auth token', async () => {
      const tokens = user.tokens || []
      const token = res.headers['x-auth']
      expect(tokens).not.toContainEqual(objectContaining({ token }))

      const userDoc = await User.findById(user._id)
      expect(userDoc.tokens).toHaveLength(tokens.length + 1)
      expect(userDoc.tokens).toContainEqual(
        objectContaining({ access: 'auth', token })
      )
    })

    it('returns the user with auth token in header', async () => {
      expect(res.headers['x-auth']).toMatch(JSON_WEB_TOKEN)
      expect(res.body.user).toEqual(pick(user, '_id', 'email'))
    })
  })

  describe('authorization', () => {
    let res
    afterEach(async () => {
      // check that no auth token has been returned
      expect(res.headers['x-auth']).toBeUndefined()
    })

    it('checks if email is unknown', async () => {
      const body = { email: `${Date.now()}@example.com`, password: 'password' }
      res = await req(body).expect(401, 'Unauthorized')
    })

    it('checks if password is incorrect', async () => {
      const user = fixtures.users[0]
      const body = { email: user.email, password: `${user.password}foo` }
      res = await req(body).expect(401, 'Unauthorized')

      // check that the user's array of tokens has not been modified
      const userDoc = await User.findById(user._id)
      expect(userDoc.tokens.toObject()).toEqual(
        user.tokens.map(item => objectContaining(pick(item, 'access', 'token')))
      )
    })
  })
})

/*
   ####  #####  #####
  #      #        #
  #  ##  ####     #
  #   #  #        #
   ####  #####    #
*/

describe('GET /users/me', () => {
  const req = token =>
    request(app)
      .get('/users/me')
      .set('X-Auth', token)

  requiresAuthentication(req)

  it('returns the authenticated user', async () => {
    const user = fixtures.userWithTokens()
    const token = fixtures.getToken(user, 'auth')
    const res = await req(token).expect(200)

    expect(res.body.user).toEqual(pick(user, '_id', 'email'))
  })
})

/*
  ####   #####  #      #####  #####  #####
  #   #  #      #      #        #    #
  #   #  ####   #      ####     #    ####
  #   #  #      #      #        #    #
  ####   #####  #####  #####    #    #####
*/

describe('DELETE /users/me/token', () => {
  const req = token =>
    request(app)
      .delete('/users/me/token')
      .set('X-Auth', token)

  requiresAuthentication(req)

  it('deletes the auth token', async () => {
    const user = fixtures.userWithTokens()
    const token = fixtures.getToken(user, 'auth')
    await req(token).expect(200)

    const userDoc = await User.findById(user._id)
    expect(userDoc.tokens).toHaveLength(user.tokens.length - 1)
    expect(userDoc.tokens).not.toContainEqual(objectContaining({ token }))
  })
})
