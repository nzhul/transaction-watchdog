const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("../filters-api/src/database"); // TODO: Extract this into common module/package
var CronJob = require("cron").CronJob;
const { ethers } = require("ethers");
const { v4: uuidv4 } = require("uuid");

app.use(express.json());
app.use(cors());

// TODOs:
// 1. Try to extract into separate modules
// 2. Try to apply filters directly on await contract.queryFilter(...)
// 3. Trigger the sync using CRON. Currently it is happening using http trigger
// 4. HOT-RELOAD
//    + functionality will work automatically because we are fetching the latest Filter on every execution
//    + We can add cache that will prevent the database call on every job run.

// ETHERS CONFIG
const INFURA_ID = "b2f2b2eaa9b84a7e9120a715b073a1cd";
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${INFURA_ID}`
);

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint)",

  "event Transfer(address indexed from, address indexed to, uint amount)",
];

const address = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Contract

const contract = new ethers.Contract(address, ERC20_ABI, provider);

app.get("/api/filter-test", async (req, res, next) => {
  const lastBlockTracker = await db.Tracker.findOne({
    name: "last-processed-block",
  });

  const lastBlock = await provider.getBlockNumber();
  let lastProcessedBlock = Number(lastBlockTracker.value);

  if (lastBlock == lastProcessedBlock) {
    console.log("Latest block is already processed. Skip!");
    res.status(200).json({
      lastBlock,
      processedTransactions: 0,
      message: "Latest block is already processed. Skip!",
    });
    return;
  }

  // Load latest filter
  const latestFilter = await db.Filter.findOne({
    order: [["createdAt", "DESC"]],
  });

  if (!lastProcessedBlock) {
    lastProcessedBlock = lastBlock - 1;
  }

  /// PROCESSING EVENTS
  const transferEvents = await contract.queryFilter(
    "Transfer",
    lastProcessedBlock,
    lastBlock
  );

  let matches = 0;

  for (let i = 0; i < transferEvents.length; i++) {
    const transaction = transferEvents[i];

    if (!(await Matches(transaction, latestFilter))) {
      continue;
    }

    matches++;

    await db.Transaction.create({
      id: uuidv4(),
      filterId: latestFilter.id,
      blockNumber: transaction.blockNumber,
      blockHash: transaction.blockHash,
      address: transaction.address,
      from: transaction.args[0],
      to: transaction.args[1],
      amount: ethers.utils.formatEther(transaction.args[2]),
    });
  }

  if (lastBlock > lastProcessedBlock && transferEvents.length > 0) {
    await db.Tracker.update(
      { value: lastBlock },
      {
        where: {
          name: "last-processed-block",
        },
      }
    );
  }

  res.status(200).json({
    lastBlock,
    totalTransactions: transferEvents.length,
    matches: matches,
  });
});

async function Matches(transaction, filter) {
  // 1. Amount is within range
  if (filter.minAmount || filter.maxAmount) {
    const amount = Number(ethers.utils.formatEther(transaction.args[2]));

    if (filter.minAmount && filter.maxAmount) {
      return amount > filter.minAmount && amount < filter.maxAmount;
    } else if (filter.minAmount) {
      return amount > filter.minAmount;
    } else {
      return amount < filter.maxAmount;
    }
  }
}

let jobRunning = false;

const job = new CronJob("0/5 * * * * *", async () => {
  console.log("cron job running every 5 seconds");
});

app.get("/api/trigger-job", (req, res, next) => {
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
