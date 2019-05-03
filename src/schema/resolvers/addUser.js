import { user as User } from '../../models'

export default {
  Mutation: {
    addUser: (parent, data) => User.create(data, { fields: ['username', 'firstName', 'lastName', 'password'] })
  }
}
