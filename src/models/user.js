import crypto from 'crypto'
import { Model } from 'sequelize'
import jwtBuilder from '../JWTBuilder'
import InvalidCredentialsError from '../errors/InvalidCredentialsError'

export function buildUserModel (sequelizeModels) {
  class User extends Model {
    static async signin (username, password) {
      const user = await User.findByUsername(username)

      await user.validatePassword(password)

      const jwt = await user.generateJWT()

      return { user, jwt }
    }

    static async findByUsername (username) {
      const user = await User.findOne({ where: { username } })

      if (!user) {
        throw new InvalidCredentialsError()
      }

      return user
    }

    async validatePassword (password) {
      const passwordIsValid = await this.passwordMatches(password)

      if (!passwordIsValid) {
        throw new InvalidCredentialsError()
      }
    }

    async passwordMatches (value, models = sequelizeModels) {
      const currentPasswordBuffer = Buffer.from(this.password, 'hex')
      const encryptedPasswordBuffer = User.getEncryptedPasswordBuffer(value, models)

      return encryptedPasswordBuffer.equals(currentPasswordBuffer)
    }

    async generateJWT () {
      const { password, ...userWithoutPassword } = await this.getAsPlainObject()
      return jwtBuilder(userWithoutPassword)
    }

    getAsPlainObject () {
      return this.get({ plain: true })
    }

    static async hashPasswordHook (user) {
      if (!user.password) return user

      const encryptedPasswordBuffer = await this.getEncryptedPasswordBuffer(user.password)

      user.password = encryptedPasswordBuffer.toString('hex')
    }

    static async getEncryptedPasswordBuffer (plainPassword, models = sequelizeModels) {
      const salt = await models.salt.getPasswordSalt()
      return crypto.scryptSync(plainPassword, salt.value, 64)
    }
  }

  return User
}

export default (sequelize, DataTypes) => {
  const User = buildUserModel(sequelize.models)

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
