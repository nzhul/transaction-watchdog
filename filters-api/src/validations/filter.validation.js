const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getFilter = {
  params: Joi.object().keys({
    filterId: Joi.number().required(),
  }),
};

module.exports = {
  getFilter,
};
