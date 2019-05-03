import { user as User } from '../../models'

export default {
  Query: {
    users: () => User.findAll(),
    user: (parent, { id }) => User.findByPk(id)
  }
}
