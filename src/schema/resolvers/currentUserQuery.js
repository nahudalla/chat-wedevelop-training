export default {
  Query: {
    currentUser: async (parent, args, { getAuthenticatedUser }) => getAuthenticatedUser()
  }
}
