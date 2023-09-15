'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'login',
      {
        type: Sequelize.ENUM,
        values: ['Dashboard','Billing','Kitchen']
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'login');
  }
};