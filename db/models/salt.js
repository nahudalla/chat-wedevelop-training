import crypto from 'crypto'
import { Model } from 'sequelize'

export default function buildSalt (sequelize, DataTypes) {
  class Salt extends Model {
    static async getPasswordSalt () {
      const lastSalt = await this.getLast()

      if (lastSalt) return lastSalt

      return this.createRandom()
    }

    static getLast () {
      return this.findOne({ order: [['createdAt', 'DESC']] })
    }

    static createRandom (bytes = 16) {
      return this.create({ value: crypto.randomBytes(bytes).toString('hex') })
    }
  }

  Salt.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, { sequelize, modelName: 'salt' })

  return Salt
}
