const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const db = require('../../src/database');

// setupTestDB();
// TODO: Clear database records on every test.


describe('Filter routes', () => {
  describe('POST /v1/filters', () => {
    test('should return 201 and successfully create new filter if data is ok', async () => {
      let newFilter = {
        name: 'BestFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      const res = await request(app).post('/v1/filters/new-filter').send(newFilter).expect(httpStatus.OK);

      expect(res.body).not.toHaveProperty('password');
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newFilter.name,
        token: newFilter.token,
        minAmount: newFilter.minAmount,
        maxAmount: newFilter.maxAmount,
        from: newFilter.from,
        to: newFilter.to,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });
  });
});
