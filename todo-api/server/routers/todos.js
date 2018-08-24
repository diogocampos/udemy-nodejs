const express = require('express')

const Todo = require('../db/Todo')
const { handleValidationError, notFound, wrap } = require('../middleware')
const { authenticate } = require('./users')

const router = express.Router()

router.param('id', (req, res, next, id) => {
  if (!Todo.isValidId(id)) return notFound(req, res)
  next()
})

router.get('/', authenticate, [
  wrap(async (req, res) => {
    const { user } = res.locals

    const todos = await Todo.find({ _creator: user._id })
    res.json({ todos })
  }),
])

router.get('/:id', authenticate, [
  wrap(async (req, res) => {
    const { id: _id } = req.params
    const { user } = res.locals

    const todo = await Todo.findOne({ _id, _creator: user._id })
    todo ? res.json({ todo }) : notFound(req, res)
  }),
])

router.post('/', authenticate, [
  wrap(async (req, res) => {
    const { title } = req.body
    const { user } = res.locals

    const todo = await new Todo({ title, _creator: user._id }).save()
    res.json({ todo })
  }),
  handleValidationError,
])

router.patch('/:id', authenticate, [
  wrap(async (req, res) => {
    const { id: _id } = req.params
    const { title, completed } = req.body
    const { user } = res.locals

    const $set = {}
    if (title) {
      $set.title = title
    }
    if (completed != null) {
      $set.completed = !!completed
      $set.completedAt = completed ? Date.now() : null
    }

    const todo = await Todo.findOneAndUpdate(
      { _id, _creator: user._id },
      { $set },
      { new: true }
    )
    todo ? res.json({ todo }) : notFound(req, res)
  }),
])

router.delete('/:id', authenticate, [
  wrap(async (req, res) => {
    const { id: _id } = req.params
    const { user } = res.locals

    const todo = await Todo.findOneAndRemove({ _id, _creator: user._id })
    todo ? res.json({ todo }) : notFound(req, res)
  }),
])

module.exports = {
  router,
}
