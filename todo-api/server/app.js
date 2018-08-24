const express = require('express')

require('./config')
require('./db/connect')

const { handleError, notFound, wrap } = require('./middleware')
const users = require('./routers/users')
const todos = require('./routers/todos')

const app = express()

app.use(express.json())
app.use('/todos', todos.router)
app.use('/users', users.router)

if (process.env.NODE_ENV === 'test') {
  const message = 'These should respond with 500'
  app.get('/boom/1', (req, res, next) => next(new Error(message)))
  app.get('/boom/2', () => { throw new Error(message) }) // prettier-ignore
  app.get('/boom/3', wrap(async () => { throw false })) // prettier-ignore
}

app.use(notFound)
app.use(handleError)

module.exports = app
