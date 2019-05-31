import models from './models'

export default (requestContext) => {
  const user = (requestContext && requestContext.req.user) || null

  return {
    isUserAuthenticated () {
      return user !== null
    },
    getAuthenticatedUser () {
      return user && models.user.findByPk(user.sub)
    }
  }
}
