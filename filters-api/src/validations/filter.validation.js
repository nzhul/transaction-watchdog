const Joi = require('joi');

const getFilter = {
  params: Joi.object().keys({
    filterId: Joi.string().guid().required(),
  }),
};

const getFilters = {
  query: Joi.object().keys({
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
    from: Joi.string(),
    to: Joi.string(),
    minAmount: Joi.number(),
    maxAmount: Joi.number(),
  }),
};

const deleteFilter = {
  params: Joi.object().keys({
    filterId: Joi.string().guid().required(),
  }),
};

module.exports = {
  getFilter,
  getFilters,
  createOrUpdateFilter,
  deleteFilter,
};
