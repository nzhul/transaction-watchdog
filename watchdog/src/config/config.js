const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({
  path: path.join(__dirname, `../../.env-${process.env.NODE_ENV}`),
});

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    CRON_EXPRESSION: Joi.string().default("0/10 * * * * *"),
    INFURA_ID: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  watchdogCron: envVars.CRON_EXPRESSION,
  infuraId: envVars.INFURA_ID,
};
