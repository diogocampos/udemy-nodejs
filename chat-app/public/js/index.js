const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// receiving messages

const $messageList = $('#message-list')

socket.on('text-message', message => {
  $messageList.append(
    $('<li></li>').text(`${messagePrefix(message)} ${message.text}`)
  )
})

socket.on('location-message', message => {
  $messageList.append(
    $('<li></li>')
      .text(messagePrefix(message))
      .append(
        $('<a target="_blank"></a>')
          .text('My current location')
          .attr('href', message.url)
      )
  )
})

function messagePrefix(message) {
  return `${new Date(message.createdAt)} - ${message.from}: `
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

  navigator.geolocation.getCurrentPosition(
    position => {
      socket.emit('send-location', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    err => {
      if (err.code === 1) return console.error('User denied access to location')
      alert(`Unable to get location: ${err.message}`)
    }
  )
})
