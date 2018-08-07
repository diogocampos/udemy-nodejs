const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// receiving messages

socket.on('text-message', renderMessage)
socket.on('location-message', renderMessage)

const $messageList = $('#message-list')
const messageTemplate = $('#message-template').html()
Mustache.parse(messageTemplate)

function renderMessage(message) {
  $messageList.append(
    Mustache.render(messageTemplate, {
      formattedTime: moment(message.createdAt).format('H:mm'),
      ...message,
    })
  )
  scrollToBottom()
}

function scrollToBottom() {
  const clientHeight = $messageList.prop('clientHeight')
  const scrollHeight = $messageList.prop('scrollHeight')
  const scrollTop = $messageList.prop('scrollTop')

  const $lastMessage = $messageList.children('li:last-child')
  const lastHeight = $lastMessage.innerHeight()
  const prevHeight = $lastMessage.prev().innerHeight()

  if (scrollTop + clientHeight + lastHeight + prevHeight >= scrollHeight) {
    $messageList.scrollTop(scrollHeight)
  }
}

// sending messages

const $messageInput = $('input[name=message]')

$('#message-form').on('submit', e => {
  e.preventDefault()

  const text = $messageInput.val()
  if (!text) return

  socket.emit('send-message', { from: 'User', text }, ack => {
    $messageInput.val('')
    console.log('Ack:', ack)
  })
})

// location

const $locationButton = $('#send-location')

$locationButton.on('click', e => {
  if (!navigator.geolocation) {
    return alert('This browser does not support geolocation.')
  }

  $locationButton.attr('disabled', 'disabled').text('Sending Location…')

  navigator.geolocation.getCurrentPosition(
    position => {
      $locationButton.removeAttr('disabled').text('Send Location')
      socket.emit('send-location', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    err => {
      $locationButton.removeAttr('disabled').text('Send Location')
      if (err.code === 1) return console.error('User denied access to location')
      alert(`Unable to get location: ${err.message}`)
    }
  )
})
