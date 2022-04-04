require("dotenv").config();
const processor = require("./processor");
const logger = require("./config/logger");
const config = require("./config/config");
var CronJob = require("cron").CronJob;

// TODOs:
// 2 Refactor database/config/config.js to use Joi and work with .env
// 2 Update README.MD with GUIDE on how to run the project.
// 3 Try to write integration and unit tests based on the examples.
// 4 Explain why I am not using Axios and Awilix

const job = new CronJob(config.watchdogCron, async () => {
  logger.info("---Processing Transactions---");
  const result = await processor.Run();
  logger.info(
    `---Processing complete: ${result.message} | TotalTransactions: ${result.totalTransactions} | Matches: ${result.matches} | LastBlock: ${result.lastBlock}`
  );
});

job.start();
