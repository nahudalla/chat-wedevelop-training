import crypto from 'crypto'
import { Model } from 'sequelize'

export default function buildUser (sequelize, DataTypes) {
  class User extends Model {
    async passwordMatches (value, models = sequelize.models) {
      const currentPasswordBuffer = Buffer.from(this.password, 'hex')
      const encryptedPasswordBuffer = User.getEncryptedPasswordBuffer(value, models)

      return encryptedPasswordBuffer.equals(currentPasswordBuffer)
    }

    static async hashPasswordHook (user) {
      if (!user.password) return user

      const encryptedPasswordBuffer = await this.getEncryptedPasswordBuffer(user.password)

      user.password = encryptedPasswordBuffer.toString('hex')
    }

    static async getEncryptedPasswordBuffer (plainPassword, models = sequelize.models) {
      const salt = await models.salt.getPasswordSalt()

      return crypto.scryptSync(plainPassword, salt.value, 64)
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, { sequelize, modelName: 'user' })

  User.beforeCreate(User.hashPasswordHook.bind(User))
  User.beforeUpdate(User.hashPasswordHook.bind(User))

  return User
}
