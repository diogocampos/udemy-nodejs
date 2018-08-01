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
    const users = db.collection('Users')
    //const result = await todos.findOneAndUpdate(
    //  { _id: new ObjectID('5b55f7a064c68a44b08cee62') },
    //  { $set: { completed: true } },
    //  { returnOriginal: false }
    //)
    const result = await users.findOneAndUpdate(
      { _id: new ObjectID('5b55f3716193d2167cb3d078') },
      {
        $set: { name: 'Diogo' },
        $inc: { age: -1 },
      },
      { returnOriginal: false }
    )
    console.log(result)
  } catch (err) {
    console.error('Failed to delete:', err)
  }
  client.close()
})()
