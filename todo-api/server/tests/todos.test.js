const request = require('supertest')

const app = require('../app')
const Todo = require('../db/Todo')
const fixtures = require('./fixtures')
const { pojo, requiresAuthentication, validatesId } = require('./helpers')

const { any, objectContaining } = expect

beforeAll(fixtures.users.populate)
beforeEach(fixtures.todos.populate)

const USER = fixtures.userWithTokens()
const ID = fixtures.newId()

const authed = (r, user = USER) => {
  const token = fixtures.getToken(user, 'auth')
  return r.set('X-Auth', token)
}

/*
  ####    ###    ####  #####
  #   #  #   #  #        #
  ####   #   #   ###     #
  #      #   #      #    #
  #       ###   ####     #
*/

describe('POST /todos', () => {
  const req = (body = {}) =>
    authed(
      request(app)
        .post('/todos')
        .send(body)
    )

  requiresAuthentication(req)

  describe('with valid data and authentication', () => {
    let title, res
    beforeEach(async () => {
      title = 'Test POST /todos endpoint'
      res = await req({ title }).expect(200)
    })

    it('creates a new todo', async () => {
      const todoDoc = await Todo.findById(res.body.todo._id)
      expect(todoDoc).toMatchObject({ title, completed: false })
    })

    it('returns the new todo', () => {
      expect(res.body.todo).toMatchObject({ title, completed: false })
    })
  })

  describe('validation', () => {
    afterEach(async () => {
      // check that a new todo has not been created
      expect(await Todo.find()).toHaveLength(fixtures.todos.length)
    })

    it('checks if title is missing', async () => {
      const res = await req({}).expect(400)
      expect(res.body.errors.title).toBeDefined()
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

describe('GET /todos', () => {
  const req = () => authed(request(app).get('/todos'))

  requiresAuthentication(req)

  it("returns the authenticated user's todos", async () => {
    const res = await req().expect(200)

    expect(res.body.todos).toEqual(
      fixtures.todosCreatedBy(USER).map(todo => objectContaining(todo))
    )
  })
})

describe('GET /todos/:id', () => {
  const req = id => authed(request(app).get(`/todos/${id}`))

  requiresAuthentication(() => req(ID))
  validatesId(req)

  it("returns the user's requested todo", async () => {
    const todo = fixtures.todosCreatedBy(USER)[0]
    const res = await req(todo._id).expect(200)

    expect(res.body.todo).toMatchObject(todo)
  })

  it("does not return other users' todos", async () => {
    const todo = fixtures.todosNotCreatedBy(USER)[0]
    await req(todo._id).expect(404, 'Not Found')
  })
})

/*
  ####    ###   #####   ####  #   #
  #   #  #   #    #    #      #   #
  ####   #####    #    #      #####
  #      #   #    #    #      #   #
  #      #   #    #     ####  #   #
*/

describe('PATCH /todos/:id', () => {
  const req = (id, body) =>
    authed(
      request(app)
        .patch(`/todos/${id}`)
        .send(body)
    )

  requiresAuthentication(() => req(ID, {}))
  validatesId(req)

  it('updates the todo and returns it', async () => {
    const todos = fixtures.todosCreatedBy(USER)
    const todo = todos.find(todo => !todo.completed)
    expect(todo.completedAt).toBeNull()

    const patch = {
      title: 'Change to completed',
      completed: true,
    }
    const expected = {
      ...patch,
      completedAt: any(Number),
    }
    const res = await req(todo._id, patch).expect(200)

    expect(res.body.todo).toMatchObject(expected)
    expect(await Todo.findById(todo._id)).toMatchObject(expected)
  })

  it("does not update other users' todos", async () => {
    const todo = fixtures.todosNotCreatedBy(USER)[0]
    const patch = {
      title: `Changed: ${todo.title}`,
      completed: !todo.completed,
    }
    await req(todo._id, patch).expect(404, 'Not Found')

    const todoDoc = await Todo.findById(todo._id)
    expect(pojo(todoDoc)).toMatchObject(todo)
  })

  it('clears `completedAt` when setting `completed` to false', async () => {
    const todos = fixtures.todosCreatedBy(USER)
    const todo = todos.find(todo => todo.completed)
    expect(todo.completedAt).toEqual(any(Number))

    const patch = {
      title: 'Change to not completed',
      completed: false,
    }
    const expected = {
      ...patch,
      completedAt: null,
    }
    const res = await req(todo._id, patch).expect(200)

    expect(res.body.todo).toMatchObject(expected)
    expect(await Todo.findById(todo._id)).toMatchObject(expected)
  })

  it('ignores `completedAt` field in request body', async () => {
    const completedAt = 123
    for (const todo of fixtures.todosCreatedBy(USER)) {
      const patch = { completed: !todo.completed, completedAt }
      const res = await req(todo._id, patch).expect(200)

      expect(res.body.todo.completedAt).not.toBe(completedAt)
    }
  })
})

/*
  ####   #####  #      #####  #####  #####
  #   #  #      #      #        #    #
  #   #  ####   #      ####     #    ####
  #   #  #      #      #        #    #
  ####   #####  #####  #####    #    #####
*/

describe('DELETE /todos/:id', () => {
  const req = id => authed(request(app).delete(`/todos/${id}`))

  requiresAuthentication(() => req(ID))
  validatesId(req)

  it('removes the todo and returns it', async () => {
    const todo = fixtures.todos[0]
    const res = await req(todo._id).expect(200)

    expect(res.body.todo).toMatchObject(todo)
    expect(await Todo.findById(todo._id)).toBeNull()
  })

  it("does not remove other users' todos", async () => {
    const todo = fixtures.todosNotCreatedBy(USER)[0]
    await req(todo._id).expect(404, 'Not Found')

    expect(await Todo.findById(todo._id)).toBeTruthy()
  })
})
