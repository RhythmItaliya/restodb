'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'login' column from the 'users' table
    await queryInterface.removeColumn('users', 'login');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'login');
   
  }
};
