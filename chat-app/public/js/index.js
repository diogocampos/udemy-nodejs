const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// receiving messages

const $messageList = $('#message-list')

socket.on('new-message', message => {
  $messageList.append(
    $('<li></li>').text(
      `${new Date(message.createdAt)} - ${message.from}: ${message.text}`
    )
  )
})

// sending messages

const $messageInput = $('input[name=message]')

$('#message-form').on('submit', e => {
  e.preventDefault()
  const text = $messageInput.val()
  if (!text) return

  socket.emit('send-message', { from: 'User', text }, ack => {
    $messageInput.val('')
    console.log('Ack:', ack)
    }
  )
})
