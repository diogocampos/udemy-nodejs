require('../server/db/connect')
const Todo = require('../server/models/Todo')

const id = '5b5889564399a2751fde6095'

!(async () => {
  try {
    let result

    result = await Todo.find({ _id: id })
    console.log('find:', result)

    result = await Todo.findOne({ _id: id })
    console.log('findOne:', result)

    result = await Todo.findById(id)
    console.log('findById:', result)
  } catch (err) {
    console.error(err)
  }
})()
