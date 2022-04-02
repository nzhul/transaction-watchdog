const express = require("express");
const app = express();
const cors = require("cors");
var CronJob = require("cron").CronJob;
require("dotenv").config();

app.use(express.json());
app.use(cors());

let jobRunning = false;
const job = new CronJob("* * * * * *", function () {
  const d = new Date();
  console.log("Every second:", d);
});

app.get("/api/job", (req, res, next) => {
  if (jobRunning) {
    job.stop();
    jobRunning = false;
  } else {
    job.start();
    jobRunning = true;
  }
  res.json({ running: jobRunning });
});

// start server
app.listen(process.env.PORT, () =>
  console.log(`\x1b[0m[LOG] Server running on port ${process.env.PORT}`)
);


// Cache: https://dev.to/franciscomendes10866/simple-in-memory-cache-in-node-js-gl4