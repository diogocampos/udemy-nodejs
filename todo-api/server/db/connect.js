const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
})
