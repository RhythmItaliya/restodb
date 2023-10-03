'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull:false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'isActive')
  }
};
