import models from './models'
import JWTBuilder from './JWTBuilder'
import buildUserAuthentication from './apolloContextUserAuthentication'

export default (requestContext) => {
  return {
    ...buildUserAuthentication(requestContext),
    models,
    createTokenForUser: JWTBuilder
  }
}
