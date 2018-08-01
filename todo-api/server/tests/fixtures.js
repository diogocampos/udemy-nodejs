const jwt = require('jsonwebtoken')
const { ObjectId } = require('mongoose').Types

const Todo = require('../db/Todo')
const User = require('../db/User')
const { pojo } = require('./helpers')

const users = (exports.users = populator(User, [
  _id => ({
    email: 'one@example.com',
    password: 'userOnePass',
    tokens: [{ access: 'auth', token: newAuthToken(_id) }],
  }),
  {
    email: 'two@example.com',
    password: 'userTwoPass',
  },
]))

const todos = (exports.todos = populator(Todo, [
  {
    title: 'Pending todo',
    _creator: users[0]._id,
  },
  {
    title: 'Completed todo',
    completed: true,
    completedAt: Date.now(),
    _creator: users[0]._id,
  },
  {
    title: "Someone else's todo",
    _creator: users[1]._id,
  },
]))

exports.getToken = (user, access) => {
  const { token } = user.tokens.find(item => item.access === access)
  return token
}

exports.newAuthToken = newAuthToken
function newAuthToken(_id = newId()) {
  return jwt.sign({ _id, access: 'auth' }, process.env.JWT_SECRET)
}

exports.newId = newId
function newId() {
  return new ObjectId().toHexString()
}

exports.todosCreatedBy = user => {
  return todos.filter(todo => todo._creator === user._id)
}

exports.todosNotCreatedBy = user => {
  return todos.filter(todo => todo._creator !== user._id)
}

exports.userWithTokens = () => {
  return users.find(user => user.tokens.length > 0)
}

//

function populator(model, items) {
  items = items.map(arg => {
    const id = newId()
    const obj = typeof arg === 'function' ? arg(id) : arg
    obj._id = id
    return pojo(new model(obj))
  })

  items.populate = async () => {
    await model.remove({})
    await Promise.all(items.map(item => new model(item).save()))
  }

  return items
}
