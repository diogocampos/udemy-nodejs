const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Client connected')

  socket.on('createMessage', message => {
    message.createdAt = Date.now()
    io.emit('newMessage', message)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
