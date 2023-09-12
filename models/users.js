'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      // define association here
    }
  }
  users.init({
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isEmail: true,
      }
    },
  }, {
    sequelize,
    modelName: 'users',
  });

  users.beforeSave('passwordencrypt', (data, _) => {
    let plainpassword = data.getDataValue('password');
    let encryptpassword = bcrypt.hashSync(plainpassword, 10);
    data.setDataValue('password', encryptpassword);
  });
  return users;
};