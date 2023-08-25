'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kitchens extends Model {
    static associate(models) {
      this.belongsTo(models.orders);
    }
  }
  kitchens.init({
    preparationStatus: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Ready'),
      defaultValue: 'Pending',
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'kitchens',
  });
  return kitchens;
};