export default {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('salts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    })
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('salts')
  }
}
