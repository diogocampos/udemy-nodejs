const http = require('http')
const socketio = require('socket.io')

const app = require('./server/app')

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {
  console.log('Client connected')

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome',
    createdAt: Date.now(),
  })
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: Date.now(),
  })

  socket.on('createMessage', message => {
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: Date.now(),
    })
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
