'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Filters', [
      {
        id: 'b16c15ce-9841-4ea5-95fb-0d21f8cd85f0', // TODO: use uuid4()
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
