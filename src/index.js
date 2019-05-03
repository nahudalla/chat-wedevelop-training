import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import schema from './schema'

dotenv.config()

const port = process.env.PORT || 7777

const expressApp = express()
const httpServer = createServer(expressApp)
const apolloServer = new ApolloServer({
  ...schema,
  instrospection: true,
  playground: true,
  tracing: true
})

apolloServer.applyMiddleware({ app: expressApp })
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  console.log(`Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`)
})
