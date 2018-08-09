exports.sanitizeJoinRequest = ({ name, room }) => {
  if (!(name = trim(name))) throw new Error('Username is required')
  if (!(room = trim(room))) throw new Error('Room name is required')
  return { name, room }
}

//

function trim(string) {
  // prettier-ignore
  return typeof string === 'string' && string.trim().split(/\s+/).join(' ')
}
