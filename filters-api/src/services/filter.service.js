const db = require('../database');
const ApiError = require('../utils/ApiError');
const { v4: uuidv4 } = require('uuid');

const getFilter = async (id) => {
  return await db.Filter.findByPk(id);
};

const getFilters = async (options) => {
  return await db.Filter.findAndCountAll({
    limit: options.limit || 10,
    offset: options.offset || 0,
  });
};

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

module.exports = {
  getFilter,
  getFilters,
  createOrUpdateFilter,
};
