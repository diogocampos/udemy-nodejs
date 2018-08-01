const jwt = require('jsonwebtoken')

const secret = '123abc'
const data = {
  id: 10,
}

const token = jwt.sign(data, secret)
console.log(token)

const decoded = jwt.verify(token, secret)
console.log(decoded)
