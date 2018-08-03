const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')
const { locationMessage, textMessage } = require('./server/utils/messages')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Client connected')

  socket.emit('text-message', textMessage('Admin', 'Welcome'))
  socket.broadcast.emit('text-message', textMessage('Admin', 'New user joined'))

  socket.on('send-message', (message, ack) => {
    io.emit('text-message', textMessage(message.from, message.text))
    ack('Sent')
  })

  socket.on('send-location', coords => {
    io.emit('location-message', locationMessage('User', coords))
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
