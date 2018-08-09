const { Sessions } = require('./sessions')

beforeEach(expect.hasAssertions)

describe('Sessions', () => {
  let sessions
  beforeEach(() => {
    sessions = new Sessions()
  })

  it('stores and retrieves a session', () => {
    const id = '123'
    const name = 'Alice'
    const room = 'Developers'
    sessions.addSession({ id, name, room })

    expect(sessions.getSession(id)).toEqual({ id, name, room })
  })

  it('ignores unknown session ids', () => {
    expect(sessions.getSession('xyz')).toBeUndefined()
  })

  it('removes a session and returns it', () => {
    const id = 'foobar'
    const name = 'Bob'
    const room = 'Node Course'
    sessions.addSession({ id, name, room })

    expect(sessions.removeSession(id)).toEqual({ id, name, room })
    expect(sessions.getSession(id)).toBeUndefined()
    expect(sessions.removeSession(id)).toBeUndefined()
  })

  it('retrieves usernames by room', () => {
    for (const session of [
      { id: '1', name: 'Daenerys', room: 'A' },
      { id: '2', name: 'Jon', room: 'B' },
      { id: '3', name: 'Tyrion', room: 'A' },
    ]) {
      sessions.addSession(session)
    }

    expect(sessions.getNames('A')).toEqual(['Daenerys', 'Tyrion'])
    expect(sessions.getNames('B')).toEqual(['Jon'])
    expect(sessions.getNames('C')).toEqual([])
  })
})
