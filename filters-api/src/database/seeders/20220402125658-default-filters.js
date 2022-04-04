'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Filters', [
      {
        id: 'b16c15ce-9841-4ea5-95fb-0d21f8cd85f0', // TODO: use uuid4()
        name: 'DAI 0.5 - 2000 filter',
        token: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        maxAmount: 2000.0,
        minAmount: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Filters', null, bulkDeleteOptions);
  },
};
