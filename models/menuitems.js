'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menuItems extends Model {
    static associate(models) {
      this.belongsTo(models.menuCategories);
      this.hasMany(models.orderItems);
    }
  }
  menuItems.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    categoryId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    itemPrice: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'menuItems',
  });
  return menuItems;
};