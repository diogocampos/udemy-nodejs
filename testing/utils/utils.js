exports.add = (a, b) => a + b

exports.square = x => x * x

exports.asyncAdd = async (a, b) => {
  await delay(100)
  return a + b
}

exports.asyncSquare = async x => {
  await delay(100)
  return x * x
}

exports.setNames = (user, fullName) => {
  const names = fullName.trim().split(/\s+/)
  if (names[0]) user.firstName = names[0]
  if (names.length > 1) user.lastName = names[names.length - 1]
  return user
}

//

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
