require("dotenv").config();
const processor = require("./processor");
const logger = require("./config/logger");
const config = require("./config/config");
var CronJob = require("cron").CronJob;

// TODOs:
// 2 Update README.MD with GUIDE on how to run the project.
// 3 Try to write integration and unit tests based on the examples.
// 4 Explain why I am not using Axios and Awilix
// 5 Don't forget about swager on the demo!
// 6. Add postman collection to the project.

// DEMO
// 1. Git download the project
// 2. Yarn install
// 3. Create empty database in postgresql called 'transaction-watchdog'
// 3. cd filters-api/src/database
// 4. npx sequelize-cli db:migrate
// 5. npx sequelize-cli db:seed:all
// 3. Yarn dev filters-api/
// 4. Show postman/Swagger
//    + Create, Update, Read One, Read All Paginated, Delete
//    + Sequelize migrations and seed
//    + Joi validators
//    + 
//    + Integration/Unit tests
// 5. yarn dev /watchdog
// 6. Explain how the watcher works
//    + Explain why i choose to not use events. (Because i keep track of progress when the service is down.) LastProcessedBlock

const job = new CronJob(config.watchdogCron, async () => {
  logger.info("---Processing Transactions---");
  const result = await processor.Run();
  logger.info(
    `---Processing complete: ${result.message} | TotalTransactions: ${result.totalTransactions} | Matches: ${result.matches} | LastBlock: ${result.lastBlock}`
  );
});

job.start();
