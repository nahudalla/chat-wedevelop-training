import path from 'path'
import fs from 'fs'
import { gql } from 'apollo-server-express'

const types = []

fs
  .readdirSync(__dirname)
  .filter(file => file.endsWith('.graphql'))
  .forEach(file => {
    const typePath = path.join(__dirname, file)
    const typeDefinition = fs.readFileSync(typePath, 'utf-8')
    const graphQLType = gql(typeDefinition)

    types.push(graphQLType)
  })

export default types
