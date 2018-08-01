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
    // const docs = await db
    //   .collection('Todos')
    //   .find({ _id: new ObjectId('5b55eed6875729157b8af60b') })
    //   .toArray()
    // console.log('Todos:', JSON.stringify(docs, null, 2))
    const count = await db
      .collection('Todos')
      .find()
      .count()
    console.log('Todos count:', count)
  } catch (err) {
    console.error('Failed to find todos:', err)
  }
  client.close()
})()
