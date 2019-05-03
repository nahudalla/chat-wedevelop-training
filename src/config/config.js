export default {
  development: {
    dialect: 'sqlite',
    storage: 'db/development.db'
  },
  test: {
    dialect: 'sqlite',
    storage: 'db/testing.db'
  },
  production: {
    dialect: 'sqlite',
    storage: 'db/production.db'
  }
}
