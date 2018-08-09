const socket = io()

const params = new URL(window.location).searchParams
const name = params.get('name')
const room = params.get('room')

socket.on('connect', () => {
  socket.emit('join', { name, room }, err => {
    if (err) {
      alert(err.message)
      history.go(-1)
    }
  })
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

  socket.emit('send-message', { from: name, text }, err => {
    if (err) return alert(err.message)
    $messageInput.val('')
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

// people

const $userList = $('#users')

socket.on('update-user-list', names => {
  $userList.html(names.map(name => $('<li>').text(name)))
})
