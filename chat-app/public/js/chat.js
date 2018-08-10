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
    document.title = `${room} | ${document.title}`
  })
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

// Updating list of people

const $userList = $('#users')

socket.on('update-user-list', names => {
  $userList.html(names.map(name => $('<li>').text(name)))
})

// Receiving messages

const $messageList = $('#message-list')
const messageTemplate = $('#message-template').html()
Mustache.parse(messageTemplate)

socket.on('text-message', renderMessage)
socket.on('location-message', renderMessage)

function renderMessage(message) {
  $messageList.append(
    Mustache.render(messageTemplate, {
      formattedTime: moment(message.createdAt).format('H:mm'),
      ...message,
    })
  )
  scrollToBottom($messageList)
}

function scrollToBottom($list) {
  const clientHeight = $list.prop('clientHeight')
  const scrollHeight = $list.prop('scrollHeight')
  const scrollTop = $list.prop('scrollTop')

  const $lastItem = $list.children('li:last-child')
  const lastHeight = $lastItem.innerHeight()
  const prevHeight = $lastItem.prev().innerHeight()

  if (scrollTop + clientHeight + lastHeight + prevHeight >= scrollHeight) {
    $list.scrollTop(scrollHeight)
  }
}

// Sending messages

const $messageInput = $('input[name=message]')

$('#message-form').on('submit', e => {
  e.preventDefault()

  const text = $messageInput.val()
  if (!text) return

  socket.emit('send-message', { text }, err => {
    if (err) return alert(err.message)
    $messageInput.val('')
  })
})

// Sending location

const $locationButton = $('#send-location')

$locationButton.on('click', async e => {
  $locationButton.attr('disabled', 'disabled').text('Sending Location…')
  try {
    const position = await getCurrentPosition()
    socket.emit(
      'send-location',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      err => err && alert(err.message)
    )
  } catch (err) {
    if (err.code === 1) return console.error('User denied access to location')
    alert(err.message)
  } finally {
    $locationButton.removeAttr('disabled').text('Send Location')
  }
})

function getCurrentPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      throw new Error('This browser does not support geolocation.')
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}
