exports.catchValidationError = (err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json(err)
  /* istanbul ignore next */ next(err)
}

// TODO: use https://www.npmjs.com/package/statuses ?
exports.notFound = sendStatus(404)
exports.unauthorized = sendStatus(401)

function sendStatus(code) {
  return (req, res) => res.sendStatus(code)
}

exports.wrap = asyncHandler => {
  return async (req, res, next) => {
    try {
      await asyncHandler(req, res, next)
    } catch (err) {
      next(err || new Error(`Promise rejected with: ${err}`))
    }
  }
}
