const db = require('../database');
const ApiError = require('../utils/ApiError');
const { v4: uuidv4 } = require('uuid');
const httpStatus = require('http-status');

/**
 * Get single filter by id
 * @param {ObjectId} id
 * @returns {Promise<Filter>}
 */
const getFilter = async (id) => {
  return await db.Filter.findByPk(id);
};

/**
 * Get paginated result of filters
 * @param {Object} options - Query options
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.offset] - Current page/offset (default = 0)
 * @returns {Promise<QueryResult>}
 */
const getFilters = async (options) => {
  return await db.Filter.findAndCountAll({
    limit: options.limit || 10,
    offset: options.offset || 0,
  });
};

/**
 * Create or update filter.
 * If the provided id is equal to 'new-filter', we will create a new filter
 * otherwise we will try to find an existing filter to update.
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Filter>}
 */
const createOrUpdateFilter = async (id, body) => {
  if (id == 'new-filter') {
    body.id = uuidv4();
    return await db.Filter.create(body);
  }

  let filter = await db.Filter.findByPk(id);
  if (!filter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Filter not found');
  }

  await db.Filter.update(body, {
    where: {
      id: id,
    },
  });

  filter = Object.assign(filter, body);

  return filter;
};

/**
 * Delete filter by id
 * @param {ObjectId} id
 * @returns {Promise<Filter>}
 */
const deleteFilter = async (id) => {
  const filter = await db.Filter.findByPk(id);
  if (!filter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Filter not found');
  }

  await db.Filter.destroy({
    where: {
      id: id,
    },
  });
};

module.exports = {
  getFilter,
  getFilters,
  createOrUpdateFilter,
  deleteFilter,
};
