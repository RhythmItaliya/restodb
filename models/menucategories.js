'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menuCategories extends Model {
    static associate(models) {
      this.hasMany(models.menuItems);
    }
  }
  menuCategories.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'menuCategories',
  });
  return menuCategories;
};