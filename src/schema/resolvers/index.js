import path from 'path'
import fs from 'fs'

const resolvers = {}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    const resolverPath = path.join(__dirname, file)
    const resolver = require(resolverPath)
    Object.assign(resolvers, resolver)
  })

export default resolvers
