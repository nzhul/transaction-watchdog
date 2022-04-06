const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const db = require('../../src/database');
const { v4: uuidv4 } = require('uuid');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Filter routes', () => {
  describe('POST /v1/filters/:filterId', () => {
    test('should create new filter and return 200, if data is ok', async () => {
      // arrange
      let newFilter = {
        name: 'MyFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      // act
      const res = await request(app).post('/v1/filters/new-filter').send(newFilter).expect(httpStatus.OK);

      // assert
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

      const dbFilter = await db.Filter.findByPk(res.body.id);
      expect(dbFilter).toBeDefined();
      expect(dbFilter).toMatchObject({
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

    test('should update filter and return 200, if data is ok', async () => {
      // arrange
      const oldFilter = {
        id: uuidv4(),
        name: 'MyFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      await db.Filter.create(oldFilter);
      const dbFilterBefore = await db.Filter.findByPk(oldFilter.id);

      const updatedFilter = { ...oldFilter };
      delete updatedFilter.id;
      updatedFilter.name = 'MyFilter-updated';

      // act
      const res = await request(app).post(`/v1/filters/${oldFilter.id}`).send(updatedFilter).expect(httpStatus.OK);

      const dbFilterAfter = await db.Filter.findByPk(oldFilter.id);

      // assert
      expect(clearMetadata(res.body)).toEqual({
        id: dbFilterAfter.id,
        name: dbFilterAfter.name,
        token: dbFilterAfter.token,
        minAmount: dbFilterAfter.minAmount,
        maxAmount: dbFilterAfter.maxAmount,
        from: dbFilterAfter.from,
        to: dbFilterAfter.to,
      });

      expect(dbFilterBefore).toBeDefined();
      expect(dbFilterAfter).toBeDefined();
      expect(dbFilterBefore.name).toEqual(oldFilter.name);
      expect(dbFilterAfter.name).toEqual(updatedFilter.name);
      expect(dbFilterBefore.createdAt).toEqual(dbFilterAfter.createdAt);
      expect(dbFilterBefore.updatedAt).not.toEqual(dbFilterAfter.updatedAt);
      expect(dbFilterBefore.updatedAt.getTime()).toBeLessThan(dbFilterAfter.updatedAt.getTime());
    });

    test('should return 404 when we try to update non-existing filter', async () => {
      const nonExistingFilter = {
        name: 'MyFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      await request(app).post(`/v1/filters/non-existing`).send(nonExistingFilter).expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 when validator fails', async () => {
      const badPayload = {};
      const res = await request(app).post(`/v1/filters/${badPayload.id}`).send(badPayload).expect(httpStatus.BAD_REQUEST);
      expect(res.body.message).toContain('is required');
    });
  });

  describe('GET /v1/filters', () => {
    test('should return paginated list of filters.', async () => {
      // arrange
      const filtersCount = 5;
      const dbFilters = [];
      for (let i = 0; i < filtersCount; i++) {
        dbFilters.push({
          id: uuidv4(),
          name: `MyFilter${i}`,
          token: 'tokenAddress1',
          minAmount: 33,
          maxAmount: 66,
          from: 'anyFrom',
          to: 'anyTo',
        });
      }

      await db.Filter.bulkCreate(dbFilters);

      // act
      const res = await request(app).get(`/v1/filters/`).send().expect(httpStatus.OK);

      // assert
      expect(res.body.count).toEqual(filtersCount);
      for (let i = 0; i < filtersCount; i++) {
        const filter = clearMetadata(res.body.rows[i]);
        expect(filter).toEqual(dbFilters[i]);
      }
    });

    test('should return subset of filters when pagination parameters are applied.', async () => {
      // arrange
      const offset = 2;
      const limit = 2;
      const filtersTotalCount = 5;
      const dbFilters = [];
      for (let i = 0; i < filtersTotalCount; i++) {
        dbFilters.push({
          id: uuidv4(),
          name: `MyFilter${i}`,
          token: 'tokenAddress1',
          minAmount: 33,
          maxAmount: 66,
          from: 'anyFrom',
          to: 'anyTo',
        });
      }

      await db.Filter.bulkCreate(dbFilters);

      // act
      const res = await request(app).get(`/v1/filters?offset=${offset}&limit=${limit}`).send().expect(httpStatus.OK);

      // assert
      expect(res.body.count).toEqual(filtersTotalCount);
      for (let i = 0; i < limit; i++) {
        const dbIndex = offset + i;
        const filter = clearMetadata(res.body.rows[i]);
        expect(filter).toEqual(dbFilters[dbIndex]);
      }
    });

    test('should return 400 when query parameters are bad', async () => {
      const res = await request(app)
        .get(`/v1/filters?offset=bad-value&limit=bad-value`)
        .send()
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toContain('must be a number');
    });
  });

  describe('GET /v1/filters:filterId', () => {
    test('should update filter and return 200, if data is ok', async () => {
      // arrange
      const newFilter = {
        id: uuidv4(),
        name: 'MyFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      await db.Filter.create(newFilter);

      // act
      const res = await request(app).get(`/v1/filters/${newFilter.id}`).send().expect(httpStatus.OK);

      // assert
      expect(clearMetadata(res.body)).toEqual({
        id: newFilter.id,
        name: newFilter.name,
        token: newFilter.token,
        minAmount: newFilter.minAmount,
        maxAmount: newFilter.maxAmount,
        from: newFilter.from,
        to: newFilter.to,
      });
    });

    test('should return 404 not-found when filter does not exist', async () => {
      // arrange, act and assert
      await request(app).get(`/v1/filters/${uuidv4()}`).send().expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 bad-request when filterId is not guid.', async () => {
      // arrange, act and assert
      await request(app).get(`/v1/filters/invalid-id-value`).send().expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/filters:filterId', () => {
    test('should delete filter and return 204 no content', async () => {
      // arrange
      const newFilter = {
        id: uuidv4(),
        name: 'MyFilter',
        token: 'tokenAddress1',
        minAmount: 33,
        maxAmount: 66,
        from: 'anyFrom',
        to: 'anyTo',
      };

      await db.Filter.create(newFilter);

      // act
      await request(app).delete(`/v1/filters/${newFilter.id}`).send().expect(httpStatus.NO_CONTENT);

      // assert
      const dbFilter = await db.Filter.findByPk(newFilter.id);
      expect(dbFilter).toBeNull();
    });

    test('should return 404 not found when we try to delete non-existing filter', async () => {
      // arrange, act and assert
      await request(app).delete(`/v1/filters/${uuidv4()}`).send().expect(httpStatus.NOT_FOUND);
    });
  });
});

function clearMetadata(object) {
  delete object.createdAt;
  delete object.updatedAt;
  return object;
}
