const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Connection')

  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
