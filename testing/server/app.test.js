const request = require('supertest')

const app = require('./app')

const req = () => request(app)

describe('GET /', () => {
  it('responds with hello world', async () => {
    await req()
      .get('/')
      .expect(200)
      .expect('Hello world!')
  })
})

describe('GET /users', () => {
  it('responds with array of users', async () => {
    const res = await req()
      .get('/users')
      .expect(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body).toContainEqual({ name: 'Andrew', age: 25 })
  })
})

it('responds with 404', async () => {
  const res = await req()
    .get('/foobar')
    .expect(404)
  expect(res.body).toMatchObject({ error: 'Not Found' })
})
