'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Filters', [
      {
        id: 1,
        name: 'Amount Filter',
        maxAmount: 20.0,
        minAmount: 0.2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Filters', null, bulkDeleteOptions);
  },
};
