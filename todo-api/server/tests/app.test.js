const request = require('supertest')

const app = require('../app')

describe('GET /boom', () => {
  const req = id => request(app).get(`/boom/${id}`)

  it('responds with 500', async () => {
    await Promise.all(
      [1, 2, 3].map(id => req(id).expect(500, 'Internal Server Error'))
    )
  })
})
