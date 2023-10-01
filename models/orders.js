'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    static associate(models) {
      this.hasMany(models.orderItems);
      this.hasOne(models.bills);
      this.hasOne(models.kitchens);
    }
  }
  orders.init({
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};