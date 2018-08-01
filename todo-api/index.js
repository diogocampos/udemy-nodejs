const app = require('./server/app')

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
