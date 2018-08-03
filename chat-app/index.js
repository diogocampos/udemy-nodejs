const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')
const { createMessage } = require('./server/utils/message')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Client connected')

  socket.emit('newMessage', createMessage('Admin', 'Welcome'))
  socket.broadcast.emit('newMessage', createMessage('Admin', 'New user joined'))

  socket.on('createMessage', (message, ack) => {
    io.emit('newMessage', createMessage(message.from, message.text))
    ack('Sent')
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
