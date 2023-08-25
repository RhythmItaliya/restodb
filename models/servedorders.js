'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class servedOrders extends Model {
    static associate(models) {
      this.belongsTo(models.orders);
    }
  }
  servedOrders.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'servedOrders',
  });
  return servedOrders;
};