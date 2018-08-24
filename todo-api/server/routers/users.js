const express = require('express')

const User = require('../db/User')
const { catchValidationError, unauthorized, wrap } = require('../middleware')

const router = express.Router()

const authenticate = wrap(async (req, res, next) => {
  const token = req.header('x-auth')
  const user = token && (await User.findByToken(token))
  if (!user) return unauthorized(req, res)

  res.locals.token = token
  res.locals.user = user
  next()
})

router.get('/me', [
  authenticate,
  (req, res) => {
    const { user } = res.locals
    res.json({ user })
  },
])

router.post('/', [
  wrap(async (req, res) => {
    const { email, password } = req.body
    const user = await new User({ email, password }).save()
    const token = await user.generateAuthToken()
    res.header('X-Auth', token).json({ user })
  }),
  catchValidationError,
])

router.post('/login', [
  wrap(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    if (!user) return unauthorized(req, res)

    const token = await user.generateAuthToken()
    res.header('X-Auth', token).json({ user })
  }),
])

router.delete('/me/token', [
  authenticate,
  wrap(async (req, res) => {
    const { user, token } = res.locals
    await user.removeToken(token)
    res.sendStatus(200)
  }),
])

module.exports = {
  authenticate,
  router,
}
