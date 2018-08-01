const { MongoClient } = require('mongodb')

!(async () => {
  let client, db
  try {
    client = await MongoClient.connect(
      'mongodb://localhost:27017',
      { useNewUrlParser: true }
    )
    console.log('Connected to MongoDB')
    db = client.db('TodoApp')
  } catch (err) {
    return console.error('Failed to connect to MongoDB:', err)
  }

  // try {
  //   // const result = await db.collection('Todos').insertOne({
  //   //   text: 'Something to do',
  //   //   completed: false,
  //   // })
  //   const result = await db.collection('Users').insertOne({
  //     name: 'Diogo Campos',
  //     age: 34,
  //     location: 'Porto Alegre',
  //   })
  //   console.log(JSON.stringify(result.ops, null, 2))
  // } catch (err) {
  //   console.error('Failed to insert:', err)
  // }

  client.close()
})()
