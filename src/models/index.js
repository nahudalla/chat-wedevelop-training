import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const env = process.env.NODE_ENV || 'development'
const configPath = path.join(__dirname, '/../config/config.js')

const config = require(configPath)[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return file.endsWith('.js') && !file.endsWith('.test.js') && (file !== path.basename(__filename))
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

export default db
