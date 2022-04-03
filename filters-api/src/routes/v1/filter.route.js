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

/**
 * @swagger
 * tags:
 *   name: Filters
 *   description: Filters management and retrieval
 */

/**
 * @swagger
 * /filters/{id}:
 *   post:
 *     summary: Create or update a filter
 *     description: Create a transaction filter. Transaction filters are used by the transaction watchdog to filder transactions by various parameters
 *     tags: [Filters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         default: new-filter
 *         description: Filter id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - token
 *               - minAmount
 *               - maxAmount
 *             properties:
 *               name:
 *                 type: string
 *               token:
 *                 type: string
 *                 description: Contract address that will be used when fetching transactions.
 *               from:
 *                 type: string
 *                 description: Sender address
 *               to:
 *                 type: string
 *                 description: Receiver address
 *               minAmount:
 *                 type: integer
 *                 minLength: 0
 *                 description: Transaction minimum value. Values below this will be ignored.
 *               maxAmount:
 *                 type: integer
 *                 minLength: 0
 *                 description: Transaction maximum value. Values above this will be ignored.
 *             example:
 *               name: My Filter
 *               token: "0x6B175474E89094C44Da98b954EedeAC495271d0F"
 *               from: "0x65DAaB5A0dAa4338d7684BB110937b1AA1C5c066"
 *               to: "0x0F569E5df7D718E71032063046B616f2837e98dD"
 *               minAmount: 0.5
 *               maxAmount: 200
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Filter'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /filters:
 *   get:
 *     summary: Get all filters
 *     description: Returns a list of filters in paginated format.
 *     tags: [Filters]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of filters
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Offset parameter, used for paging.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Filter'
 *                 count:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /filters/{id}:
 *   get:
 *     summary: Get a single filter
 *     description: Gets a single filter by searching by id.
 *     tags: [Filters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Filter id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Filter'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a filter
 *     description: Deletes a single filter by searching by id.
 *     tags: [Filters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Filter id
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
