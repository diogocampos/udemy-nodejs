const { locationMessage, textMessage } = require('./messages')

const { any } = expect

beforeEach(expect.hasAssertions)

describe('locationMessage', () => {
  it('creates a location message object', () => {
    const from = 'Alice'
    const latitude = -30.1
    const longitude = -51.2
    const message = locationMessage(from, { latitude, longitude })

    expect(message).toEqual({
      from,
      url: `https://www.google.com/maps?q=${latitude},${longitude}`,
      createdAt: any(Number),
    })
  })
})

describe('textMessage', () => {
  it('creates a text message object', () => {
    const from = 'Bob'
    const text = 'Hi there'
    const message = textMessage(from, text)

    expect(message).toEqual({ from, text, createdAt: any(Number) })
  })
})
