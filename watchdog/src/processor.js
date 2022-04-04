const db = require("../../filters-api/src/database"); // TODO: Extract this into common module/package
const { ethers } = require("ethers");
const { v4: uuidv4 } = require("uuid");
const config = require("./config/config");

const TRACKER_NAME = "last-processed-block";

async function Run() {
  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${config.infuraId}`
  );

  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint)",

    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  // Load latest filter
  // [comment] In real-case scenario we will probably want to iterate all filters. But this highly depends from the business requirements.
  // Thats why I am just using the latest filter for demonstration purposes.
  const latestFilter = await db.Filter.findOne({
    order: [["updatedAt", "DESC"]],
    logging: false,
  });

  const contract = new ethers.Contract(latestFilter.token, ERC20_ABI, provider);

  const lastBlockTracker = await db.Tracker.findOne({
    name: TRACKER_NAME, // TODO: Extract into config or local constant.
    logging: false,
  });

  const lastBlock = await provider.getBlockNumber();
  let lastProcessedBlock = Number(lastBlockTracker.value);

  if (lastBlock == lastProcessedBlock) {
    return {
      totalTransactions: 0,
      matches: 0,
      lastBlock: lastBlock,
      message: "Latest block has already been processed in previous run. Skip!",
    };
  }

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
          name: TRACKER_NAME,
        },
        logging: false,
      }
    );
  }

  return {
    totalTransactions: transferEvents.length,
    matches: matches,
    lastBlock: lastBlock,
    message: "Success",
  };
}

async function Matches(transaction, filter) {
  const compareResults = [];
  // 1. Amount is within range
  if (filter.minAmount || filter.maxAmount) {
    const amount = Number(ethers.utils.formatEther(transaction.args[2]));

    if (filter.minAmount && filter.maxAmount) {
      compareResults.push(
        amount > filter.minAmount && amount < filter.maxAmount
      );
    } else if (filter.minAmount) {
      compareResults.push(amount > filter.minAmount);
    } else {
      compareResults.push(amount < filter.maxAmount);
    }
  }

  // 2. `from` and `to`
  if (filter.from || filter.to) {
    const from = transaction.args[0];
    const to = transaction.args[1];

    if (filter.from && filter.to) {
      compareResults.push(filter.from == from && filter.to == to);
    } else if (filter.from) {
      compareResults.push(filter.from == from);
    } else {
      compareResults.push(filter.to == to);
    }
  }

  return compareResults.some((x) => x === true);
}

module.exports = {
  Run,
};
