const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getFilter = {
  params: Joi.object().keys({
    filterId: Joi.string().guid().required(),
  }),
};

const getFilters = {
  params: Joi.object().keys({
    limit: Joi.number(),
    offset: Joi.number(),
  }),
};

const createOrUpdateFilter = {
  params: Joi.object().keys({
    filterId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    token: Joi.string().required(),
    from: Joi.string(), // TODO: Regex validate it matches Blockchain `Address` format
    to: Joi.string(), // TODO: Regex validate it matches Blockchain `Address` format
    minAmount: Joi.number(), // TODO: Validate it is `float`
    maxAmount: Joi.number(), // TODO: Validate it is `float`
  }),
};

module.exports = {
  getFilter,
  getFilters,
  createOrUpdateFilter,
};
