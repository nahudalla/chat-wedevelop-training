export default {
  Mutation: {
    async signin (parent, input, context) {
      const { data: userCredentials } = input
      const { username, password } = userCredentials

      try {
        return await context.models.user.signin(username, password)
      } catch (e) {
        return { error: e.message }
      }
    }
  }
}
