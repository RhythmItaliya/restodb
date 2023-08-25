'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderItems extends Model {
    static associate(models) {
      this.belongsTo(models.orders);
      this.belongsTo(models.menuItems);
    }
  }
  orderItems.init({
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
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
    modelName: 'orderItems',
  });
  return orderItems;
};