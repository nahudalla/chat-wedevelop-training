import path from 'path'
import fs from 'fs'

const resolvers = fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js' && !file.endsWith('.test.js'))
  .map(file => path.join(__dirname, file))
  .reduce((acc, resolverPath) => ({ ...acc, ...require(resolverPath) }), {})

export default resolvers
