const utils = require('./utils')

describe('add', () => {
  it('adds two numbers', () => {
    const result = utils.add(33, 11)
    expect(result).toBe(44)
  })
})

describe('square', () => {
  it('squares a number', () => {
    const result = utils.square(9)
    expect(result).toBe(81)
  })
})

describe('asyncAdd', () => {
  it('adds two numbers asynchronously', async () => {
    const result = await utils.asyncAdd(23, 42)
    expect(result).toBe(65)
  })
})

describe('asyncSquare', () => {
  it('squares a number asynchronously', async () => {
    const result = await utils.square(8)
    expect(result).toBe(64)
  })
})

describe('setName', () => {
  let user
  beforeEach(() => {
    user = { location: 'Porto Alegre' }
  })

  it('sets the first and last name', () => {
    utils.setNames(user, 'Foo Bar')
    expect(user.firstName).toBe('Foo')
    expect(user.lastName).toBe('Bar')
  })

  it('ignores middle names', () => {
    utils.setNames(user, 'Foo Baz Qux Bar')
    expect(user.firstName).toBe('Foo')
    expect(user.lastName).toBe('Bar')
  })

  it('ignores extra whitespace', () => {
    utils.setNames(user, ' \t Foo \t  Bar \n\r ')
    expect(user.firstName).toBe('Foo')
    expect(user.lastName).toBe('Bar')
  })

  it('does nothing when given a blank string', () => {
    utils.setNames(user, '  ')
    expect(user.firstName).toBeUndefined()
    expect(user.lastName).toBeUndefined()
  })

  it('only sets firstName when given one name', () => {
    utils.setNames(user, ' Foo ')
    expect(user.firstName).toBe('Foo')
    expect(user.lastName).toBeUndefined()
  })

  it('keeps existing user properties', () => {
    const original = { ...user }
    utils.setNames(user, 'Foo Bar')
    expect(user).toMatchObject(original)
  })

  it('returns the same user object', () => {
    const result = utils.setNames(user, 'Foo Bar')
    expect(result).toBe(user)
  })
})
