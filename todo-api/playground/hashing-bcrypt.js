const bcrypt = require('bcryptjs')

!(async () => {
  const password = '123abc!'

  // const salt = await bcrypt.genSalt(10)
  // const hash = await bcrypt.hash(password, salt)
  const hash = await bcrypt.hash(password, 10)
  console.log(hash)

  console.log(await bcrypt.compare(password, hash))
  console.log(await bcrypt.compare('foobar', hash))
})()
