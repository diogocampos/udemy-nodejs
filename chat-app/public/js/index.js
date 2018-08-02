const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('newMessage', message => {
  console.log(
    `${new Date(message.createdAt)} - ${message.from}: ${message.text}`
  )
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})
