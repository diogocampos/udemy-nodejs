const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// receiving messages

const $messageList = $('#message-list')

socket.on('newMessage', message => {
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
  socket.emit(
    'createMessage',
    { from: 'User', text: $messageInput.val() },
    ack => {
      $messageInput.val('')
      console.log('Ack:', ack)
    }
  )
})
