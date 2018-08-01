const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.get('/users', (req, res) => {
  res.json([
    {
      name: 'Andrew',
      age: 25,
    },
    {
      name: 'Diogo',
    },
  ])
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    name: 'Todo App v1.0',
  })
})

module.exports = app
