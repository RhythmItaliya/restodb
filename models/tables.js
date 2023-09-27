'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tables extends Model {
    static associate(models) {
      // define association here
    }
  }
  tables.init({
    table: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
  }, {
    sequelize,
    modelName: 'tables',
  });
  return tables;
};