'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('kitchens', 'preparationStatus',
      {
        type: Sequelize.ENUM,
        values: ['Pending','Complete','In Progress']
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('kitchens', 'preparationStatus');
  }
};