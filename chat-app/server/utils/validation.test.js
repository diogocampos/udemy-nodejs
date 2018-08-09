const { sanitizeJoinRequest } = require('./validation')

beforeEach(expect.hasAssertions)

describe('sanitizeJoinRequest', () => {
  it('returns valid join params', () => {
    const name = 'Alice'
    const room = 'Developers'
    const params = sanitizeJoinRequest({ name, room })
    expect(params).toEqual({ name, room })
  })

  it('ignores unknown entries', () => {
    const name = 'Bob'
    const room = 'Designers'
    const params = sanitizeJoinRequest({ name, room, foo: 'bar' })
    expect(params).toEqual({ name, room })
  })

  it('trims extra whitespace around and inside strings', () => {
    const name = ' \t Andrew  '
    const room = ' Node    Course \n'
    const params = sanitizeJoinRequest({ name, room })
    expect(params).toEqual({ name: 'Andrew', room: 'Node Course' })
  })

  it('throws when something is missing or invalid', () => {
    const cases = [
      {},
      { name: 'Name' },
      { room: 'Room' },
      { name: 'Name', room: '' },
      { name: '  ', room: 'Room' },
      { name: 'Name', room: 42 },
    ]
    for (const params of cases) {
      expect(() => sanitizeJoinRequest(params)).toThrow(/ is required$/)
    }
  })
})
