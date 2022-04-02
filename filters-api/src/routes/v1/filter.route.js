const express = require('express');
const validate = require('../../middlewares/validate');
const filterValidation = require('../../validations/filter.validation');
const filterController = require('../../controllers/filter.controller');

const router = express.Router();

router.get('/:filterId', validate(filterValidation.getFilter), filterController.getFilter);

module.exports = router;
