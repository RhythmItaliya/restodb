'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    static associate(models) {
      this.hasMany(models.orders)    
    }
  }
  customers.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 30]
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      isNumeric: true,
      allowNull: true,
      validate: {
        len: [10, 11]
      }
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'customers',
  });
  return customers;
};  