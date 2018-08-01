const sha256 = require('crypto-js/sha256')

const message = 'I am user number 3'
const hash = sha256(message).toString()
console.log(hash)

const data = {
  id: 4,
}
const token = {
  data,
  hash: sha256(JSON.stringify(data) + 'somesecret').toString(),
}
console.log(token.hash)
