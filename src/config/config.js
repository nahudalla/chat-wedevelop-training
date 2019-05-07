if (notInTestEnvironment() && configNotSet()) {
  throw new Error('Database connection options not found!')
}

export default {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    database: 'chat_wedevelop',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:'
  }
}

function configNotSet () {
  return typeof process.env.DB_HOST !== 'string' ||
         typeof process.env.DB_USERNAME !== 'string' ||
         typeof process.env.DB_PASSWORD !== 'string'
}

function notInTestEnvironment () {
  return process.env.NODE_ENV !== 'test'
}
