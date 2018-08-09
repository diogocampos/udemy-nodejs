const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')
const { locationMessage, textMessage } = require('./server/utils/messages')
const { sanitizeJoinRequest } = require('./server/utils/validation')
const { Sessions } = require('./server/utils/sessions')

const server = http.createServer(app)
const io = socketio(server)

const sessions = new Sessions()

io.on('connection', socket => {
  console.log('Client connected')

  socket.on('join', (params, ack) => {
    try {
      params = sanitizeJoinRequest(params)
      ack()
    } catch (err) {
      return ack({ message: err.message })
    }

    const { name, room } = params
    sessions.addSession({ id: socket.id, name, room })
    socket.join(room)

    io.to(room).emit('update-user-list', sessions.getNames(room))

    socket.emit('text-message', textMessage('Admin', `Welcome to ${room}!`))

    socket.broadcast
      .to(room)
      .emit(
        'text-message',
        textMessage('Admin', `${name} has joined the room.`)
      )
  })

  socket.on('send-message', (message, ack) => {
    io.emit('text-message', textMessage(message.from, message.text))
    ack()
  })

  socket.on('send-location', coords => {
    io.emit('location-message', locationMessage('User', coords))
  })

  socket.on('disconnect', () => {
    const { name, room } = sessions.removeSession(socket.id)
    io.to(room).emit(
      'text-message',
      textMessage('Admin', `${name} has left the room.`)
    )
    io.to(room).emit('update-user-list', sessions.getNames(room))
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
