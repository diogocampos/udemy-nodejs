const express = require('express')

require('./config')
require('./db/connect')

const { notFound } = require('./middleware')
const users = require('./routers/users')
const todos = require('./routers/todos')

const app = express()

app.use(express.json())
app.use('/todos', todos.router)
app.use('/users', users.router)

app.use(notFound)

app.use((err, req, res, next) => /* istanbul ignore next */ {
  console.error(err)
  res.sendStatus(500)
})

module.exports = app
