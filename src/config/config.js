const commonConfig = {
  dialect: 'sqlite'
}

export default {
  development: {
    ...commonConfig,
    storage: 'db/development.db'
  },
  test: {
    ...commonConfig,
    storage: 'db/testing.db'
  },
  production: {
    ...commonConfig,
    storage: 'db/production.db'
  }
}
