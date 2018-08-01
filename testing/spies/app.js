const db = require('./db')

exports.handleSignup = (email, password) => {
  // check if user already exists
  db.saveUser({ email, password })
  // send welcome email
}
