const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Number,
    default: null,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
})

todoSchema.statics.isValidId = function(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

module.exports = mongoose.model('Todo', todoSchema)
