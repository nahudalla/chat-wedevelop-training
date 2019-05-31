import path from 'path'
import fs from 'fs'
import deepmerge from 'deepmerge'

const resolvers = fs
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js' && !file.endsWith('.test.js'))
  .map(file => path.join(__dirname, file))
  .reduce((acc, resolverPath) => deepmerge(acc, require(resolverPath)), {})

export default resolvers
