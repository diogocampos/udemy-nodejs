require('../server/db/connect')
const Todo = require('../server/models/Todo')

!(async () => {
  // const result = await Todo.remove({})
  // console.log(result)

  //Todo.findOneAndRemove

  const todo = await Todo.findByIdAndRemove('5b58a78cc55b927f9a3b542a')
  console.log(todo)
})()
