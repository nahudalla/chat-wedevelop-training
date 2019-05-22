
const INVALID_CREDENTIALS_ERROR_MESSAGE = 'Invalid username and/or password'

export default {
  Mutation: {
    async signin (parent, { data: { username, password: passwordFromClient } }, context) {
      const user = await context.models.user.findOne({ where: { username } })

      if (user) {
        const passwordMatches = await user.passwordMatches(passwordFromClient)

        if (passwordMatches) {
          const { password, ...userWithoutPassword } = user.get({ plain: true })

          return {
            user: userWithoutPassword,
            jwt: context.createTokenForUser(userWithoutPassword)
          }
        } else {
          return {
            error: INVALID_CREDENTIALS_ERROR_MESSAGE
          }
        }
      } else {
        return {
          error: INVALID_CREDENTIALS_ERROR_MESSAGE
        }
      }
    }
  }
}
