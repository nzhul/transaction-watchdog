# Transaction Watchdog

Transaction watchdog is an Ethereum blockchain monitoring tool. The project consists of two parts. Watchdog background service and Filters API.


## Quick Start

### API
1. Clone the project locally
2. Create an empty postgresql database called `transaction-watchdog`. I am using sequelize, and the project will probably work with MySQL, but I haven't tested it with mysql, so I highly recommend to use postgresql.
3. Navigate to `{projectPath}/filters-api/`
4. Run `yarn install` - this will restore all npm packages.
5. Run `yarn dev` - this will trigger the sequelize.sync() method and the database.
6. Navigate to `{projectPath}/filters-api/src/database` and execute the following command: `npx sequelize-cli db:seed:all`. This will seed the required data to the database.
7. API project should be running now.

### Watcher
1. Make sure API project is running and functional.
2. Navigate to `{projectPath}/watcher/` and execute `yarn install` and then `yarn dev`
3. The watcher service should start and trigger an CRON job. The cron job is executed every 10 seconds by default.

ℹ️ If you have trouble running the project, please check my video recording here:
- How to run video: https://www.youtube.com/watch?v=WZTHvQbFWfQ
- Project details video: https://www.youtube.com/watch?v=Aqp0vmtO_3U

# How Watcher works
There were two options of implementing the watcher. Listening directly for events from the blockchain or implementing an background cron job that keeps track of the last processed block and processes only the unprocessed blocks. I've decided to go with the second approach because it gives the benefit of `not loosing data when the service is down`.

Here are the watchdog processor steps:
1. Load the lastly updated filter from the database. By doing this we are always using the latest filter. In order to increase performance this call can be cached.
2. Load from the database the lastProcessedBlock. If the value from the database is NULL, we will assign the value to be equal to lastBlock - 1
3. Load the lastBlock from the blockchain.
4. Execute an query against the blockchain to get all the transactions in the interval `lastProcessedBlock` and `lastBlock`
5. Iterate and filter all transactions.
6. Store the transactions that pass the filtering into the database.
7. If there processing is successful and we manage to store transasactions, we update the lastProcessedBlock tracker in the database. By doing this the next time the job runs, we will continue from where we left. That is true even if the service stops.

## Integration tests
1. Navigate to {projectPath}/filters-api/ and execute `yarn test`

## Swagger
1. Make sure API project is running and functional.
2. Open the following address in your web browser `http://localhost:3000/v1/docs/`


## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values. 
There are two separate `.env` files for both `filters-api` and `watcher`.

```bash
# API
PORT=3000 # Port number
DB_HOST=127.0.0.1 # postgre host url
DB_DATABASE=transaction-watchdog # postgre database name
DB_USERNAME=admin # postgre username
DB_PASSWORD=admin # postgre password
DB_DIALECT=postgres # sequelize dialect


# Watcher
NODE_ENV=development # app environment
CRON_EXPRESSION=0/10 * * * * * # Background Job CRON Expression - By default the job will run every 10 seconds
INFURA_ID=b2f2b2eaa9b84a7e9120a715b073a1cd # Infura project id
DB_HOST=127.0.0.1 # postgre host url
DB_DATABASE=transaction-watchdog # postgre database name
DB_USERNAME=admin # postgre username
DB_PASSWORD=admin # postgre password
DB_DIALECT=postgres # sequelize dialect
```

## API Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--database\       # database layer
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Watcher Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--processor.js\   # Watchdog processor service.
 |--index.js\       # App Entry point and background job trigger.
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Filter routes**:\
`POST /v1/filters/new-filter` - creates a new filter\
`POST /v1/filters/:filterId` - updates an existing filter\
`GET /v1/filters/` - returns a paginated list of filters\
`GET /v1/filters/:filterId` - returns a single filter\
`DELETE /v1/filters/:filterId` - deletes a filter\

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, we are also wrapping the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

## Logging

For logging we are using the [Winston](https://github.com/winstonjs/winston) logging library. Logging configuration is in `src/config/logger.js`.
