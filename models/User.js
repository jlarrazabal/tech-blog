const bcrypt = require("bcrypt");
const {Model, DataTypes} = require("sequelize");

const sequelize = require("../config/connection.js");

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: "user",
  hooks: {
    beforeCreate: async (newUserData) => {
      newUserData.password = await bcrypt.hash(req.body.password, 10);
      return newUserData;
    },
    beforeUpdate: async (userData) => {
      userData.password = await bcrypt.hash(req.body.password, 10);
      return userData;
    }
  }
});


module.exports = User;
