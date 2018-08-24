const sendStatus = code => (req, res) => res.sendStatus(code)
exports.unauthorized = sendStatus(401)
exports.notFound = sendStatus(404)

exports.wrap = asyncHandler => {
  return async (req, res, next) => {
    try {
      await asyncHandler(req, res, next)
    } catch (err) {
      next(err || new Error(`Promise rejected with: ${err}`))
    }
  }
}

exports.handleBadRequest = (err, req, res, next) => {
  if (err.name === 'CastError') {
    const errors = { [err.path]: `Bad value for "${err.path}"` }
    return res.status(400).json({ errors })
  }
  if (err.name === 'ValidationError') {
    const errors = {}
    for (const [path, { name, message }] of Object.entries(err.errors)) {
      errors[path] = name === 'CastError' ? `Bad value for "${path}"` : message
    }
    return res.status(400).json({ errors })
  }
  /* istanbul ignore next */ next(err)
}

exports.handleError = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') console.error(err)
  res.sendStatus(500)
}
