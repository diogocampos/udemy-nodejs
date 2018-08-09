const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')
const { locationMessage, textMessage } = require('./server/utils/messages')
const { sanitizeJoinRequest } = require('./server/utils/validation')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Client connected')

  socket.emit('text-message', textMessage('Admin', 'Welcome'))
  socket.broadcast.emit('text-message', textMessage('Admin', 'New user joined'))
  socket.on('join', (params, ack) => {
    try {
      params = sanitizeJoinRequest(params)
      ack()
    } catch (err) {
      return ack({ message: err.message })
    }
  })

  socket.on('send-message', (message, ack) => {
    io.emit('text-message', textMessage(message.from, message.text))
    ack()
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
