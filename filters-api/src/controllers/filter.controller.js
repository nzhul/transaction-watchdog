const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { filterService } = require('../services');

const getFilter = catchAsync(async (req, res) => {
  const filter = await filterService.getFilter(req.params.filterId);

  if (!filter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Filter not found');
  }

  res.send(filter);
});

module.exports = {
  getFilter,
};
