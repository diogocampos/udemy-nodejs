const { MongoClient, ObjectID } = require('mongodb')

!(async () => {
  let client, db
  try {
    client = await MongoClient.connect(
      'mongodb://localhost:27017',
      { useNewUrlParser: true }
    )
    db = client.db('TodoApp')
    console.log('Connected to MongoDB')
  } catch (err) {
    return console.error('Failed to connect to MongoDB:', err)
  }

  try {
    const todos = db.collection('Todos')

    // deleteMany
    //const result = await todos.deleteMany({ text: 'Eat lunch' })
    //console.log(result)

    // deleteOne
    //const result = await todos.deleteOne({ text: 'Eat lunch' })
    //console.log(result)

    // findOneAndDelete
    const result = await todos.findOneAndDelete({ text: 'Eat lunch' })
    console.log(result)
  } catch (err) {
    console.error('Failed to delete:', err)
  }
  client.close()
})()
