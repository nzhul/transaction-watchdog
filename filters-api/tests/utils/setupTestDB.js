const db = require('../../src/database');

const setupTestDB = () => {
  beforeAll(async () => {
    await db.sequelize.sync();
  });

  beforeEach(async () => {
    // TODO: foreach all models.
    await db.Transaction.destroy({ where: {}, truncate: true });
    await db.Tracker.destroy({ where: {}, truncate: true });
    await db.Filter.destroy({ where: {}, truncate: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
};

module.exports = setupTestDB;
