const fixtures = require('./fixtures')

exports.pojo = doc => {
  return JSON.parse(JSON.stringify(doc.toObject()))
}

exports.requiresAuthentication = req => {
  it('requires authentication', async () => {
    const badTokens = [
      null, // missing
      'foobar', // invalid
      fixtures.newAuthToken(), // unknown
    ]
    await Promise.all(
      badTokens.map(token =>
        req()
          .set('X-Auth', token)
          .expect(401, 'Unauthorized')
      )
    )
  })
}

exports.validatesId = requestById => {
  it('validates `id` parameter', async () => {
    const badIds = [
      fixtures.newId(), // unknown id
      'foobar', // invalid id
    ]
    await Promise.all(
      badIds.map(id => requestById(id).expect(404, 'Not Found'))
    )
  })
}
