const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const isEmail = require('validator/lib/isEmail')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: [isEmail, 'Email must be valid'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['auth'],
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
})

userSchema.plugin(uniqueValidator, { message: 'Email is already in use' })

userSchema.statics.findByCredentials = async function(email, password) {
  const User = this
  const user = await User.findOne({ email })
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  return isValid ? user : null
}

userSchema.statics.findByToken = async function(token) {
  const User = this
  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return null
  }
  const user = await User.findById(payload._id)
  const isValidToken =
    user &&
    user.tokens.find(item => item.access === 'auth' && item.token === token)
  return isValidToken ? user : null
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const access = 'auth'
  const payload = { _id: user._id.toHexString(), access }
  const token = jwt.sign(payload, process.env.JWT_SECRET)

  user.tokens.unshift({ access, token })
  await user.save()
  return token
}

userSchema.methods.removeToken = async function(token) {
  const user = this
  await user.updateOne({
    $pull: { tokens: { token } },
  })
}

userSchema.methods.toJSON = function() {
  const user = this
  return {
    _id: user._id,
    email: user.email,
  }
}

userSchema.pre('save', async function() {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})

module.exports = mongoose.model('User', userSchema)
