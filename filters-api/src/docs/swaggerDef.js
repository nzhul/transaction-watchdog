const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Ethereum Filters API documentation',
    version,
    description: "Ethereum Filters API provides a way to create custom filters, which will be used by the transaction watchdog."
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
