import 'dotenv/config'
import passportMiddleware from './passportMiddleware'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import schema from './schema'

import contextBuilder from './apolloContextBuilder'

const port = process.env.PORT || 7777

const expressApp = express()
const httpServer = createServer(expressApp)
const apolloServer = new ApolloServer({
  ...schema,
  instrospection: true,
  playground: true,
  tracing: true,
  context: contextBuilder
})

expressApp.use(passportMiddleware)
apolloServer.applyMiddleware({ app: expressApp })
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  console.log(`Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`)
})
