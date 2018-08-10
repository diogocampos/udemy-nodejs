const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const { locationMessage, textMessage } = require('./utils/messages')
const { sanitizeJoinRequest } = require('./utils/validation')
const { Sessions } = require('./utils/sessions')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)
const io = socketio(server)

const sessions = new Sessions()

io.on('connection', socket => {
  socket.on('join', (params, ack) => {
    try {
      params = sanitizeJoinRequest(params)
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
    ack()
  })

  socket.on('send-message', (message, ack) => {
    const session = sessions.getSession(socket.id)
    if (!session) return ack({ message: 'Invalid session' })

    io.to(session.room).emit(
      'text-message',
      textMessage(session.name, message.text)
    )
    ack()
  })

  socket.on('send-location', (coords, ack) => {
    const session = sessions.getSession(socket.id)
    if (!session) return ack({ message: 'Invalid session' })

    io.to(session.room).emit(
      'location-message',
      locationMessage(session.name, coords)
    )
    ack()
  })

  socket.on('disconnect', () => {
    const session = sessions.removeSession(socket.id)
    if (!session) return

    io.to(session.room).emit(
      'text-message',
      textMessage('Admin', `${session.name} has left the room.`)
    )
    io.to(session.room).emit(
      'update-user-list',
      sessions.getNames(session.room)
    )
  })
})

module.exports = server
