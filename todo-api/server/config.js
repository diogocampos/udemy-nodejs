const localMongoDB = 'mongodb://localhost:27017/TodoApp'
const secret = () => Math.random().toString(26).slice(2) //prettier-ignore

const env = {
  development: {
    JWT_SECRET: secret(),
    MONGODB_URI: localMongoDB,
    PORT: process.env.PORT || 3000,
  },
  test: {
    JWT_SECRET: secret(),
    MONGODB_URI: localMongoDB,
    //PORT
  },
}

const NODE_ENV = (process.env.NODE_ENV =
  process.env.NODE_ENV || /* istanbul ignore next */ 'development')

Object.assign(process.env, env[NODE_ENV] || /* istanbul ignore next */ {})
