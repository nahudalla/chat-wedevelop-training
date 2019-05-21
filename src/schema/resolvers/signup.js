const USERNAME_NOT_AVAILABLE_ERROR_MESSAGE = 'Username already taken'

export default {
  Mutation: {
    async signup (parent, { data: { username, ...newUserData } }, context) {
      const [ user, created ] = await context.models.user.findOrCreate({
        where: { username },
        defaults: { username, ...newUserData }
      })

      if (created) {
        return buildNewUserCreatedResponse(user, context)
      } else {
        return buildUserExistsResponse()
      }
    }
  }
}

function buildNewUserCreatedResponse ({ id, username, firstName, lastName }, context) {
  const user = { id, username, firstName, lastName }
  const jwt = context.createTokenForUser(user)

  return { user, jwt }
}

function buildUserExistsResponse () {
  return {
    authError: USERNAME_NOT_AVAILABLE_ERROR_MESSAGE
  }
}
