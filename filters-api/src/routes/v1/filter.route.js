const express = require('express');
const validate = require('../../middlewares/validate');
const filterValidation = require('../../validations/filter.validation');
const filterController = require('../../controllers/filter.controller');

const router = express.Router();

router.get('/', validate(filterValidation.getFilters), filterController.getFilters);
router.get('/:filterId', validate(filterValidation.getFilter), filterController.getFilter);
router.post('/:filterId', validate(filterValidation.createOrUpdateFilter), filterController.createOrUpdateFilter);
router.delete('/:filterId', validate(filterValidation.deleteFilter), filterController.deleteFilter);

module.exports = router;
