const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { filterService } = require('../services');

// TODO: Update SWAGGER for the new controllers!!

/**
 * [GET]
 * /v1/filters/{uuid}
 */
const getFilter = catchAsync(async (req, res) => {
  const filter = await filterService.getFilter(req.params.filterId);

  if (!filter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Filter not found');
  }

  res.send(filter);
});

/**
 * [GET]
 * /v1/filters/
 */
const getFilters = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'offset']);
  const resut = await filterService.getFilters(options);
  res.send(resut);
});

/**
 * [POST]
 * /v1/filters
 */
const createOrUpdateFilter = catchAsync(async (req, res) => {
  const filter = await filterService.createOrUpdateFilter(req.params.filterId, req.body);
  res.send(filter);
});

/**
 * [DELETE]
 * /v1/filters/{uuid}
 */
const deleteFilter = catchAsync(async (req, res) => {
  await filterService.deleteFilter(req.params.filterId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getFilter,
  getFilters,
  createOrUpdateFilter,
  deleteFilter
};
