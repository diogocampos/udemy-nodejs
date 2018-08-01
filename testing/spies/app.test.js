const app = require('./app')

const db = require('./db')
jest.mock('./db')

describe('handleSignup', () => {
  it('calls the mock correctly', () => {
    const mock = jest.fn()
    mock('Andrew', 25)
    expect(mock).toHaveBeenCalledWith('Andrew', 25)
  })

  it('calls db.saveUser with user object', () => {
    const email = 'foo@example.com'
    const password = '123'
    app.handleSignup(email, password)
    expect(db.saveUser).toHaveBeenCalledWith({ email, password })
  })
})
