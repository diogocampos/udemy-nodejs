const { createMessage } = require('./message')

const { any } = expect

describe('createMessage', () => {
  it('creates a message object', () => {
    const from = 'John'
    const text = 'Hey'
    const message = createMessage(from, text)

    expect(message).toEqual({ from, text, createdAt: any(Number) })
  })
})
