require("dotenv").config();
const processor = require("./processor");
const logger = require("./config/logger");
const config = require("./config/config");
var CronJob = require("cron").CronJob;

const job = new CronJob(config.watchdogCron, async () => {
  logger.info("---Processing Transactions---");
  const result = await processor.Run();
  logger.info(
    `---Processing complete: ${result.message} | TotalTransactions: ${result.totalTransactions} | Matches: ${result.matches} | LastBlock: ${result.lastBlock}`
  );
});

job.start();
