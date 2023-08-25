'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class feedbacks extends Model {
    static associate(models) {
      this.belongsTo(models.customers)
    }
  }
  feedbacks.init({
    customerId:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    feedbackText:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    reaction:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    }, 
  }, {
    sequelize,
    modelName: 'feedbacks',
  });
  return feedbacks;
};