const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, `../../.env`) });

const envVarsSchema = Joi.object()
  .keys({
    DB_HOST: Joi.string().default('127.0.0.1'),
    DB_DATABASE: Joi.string().default('transaction-watchdog'),
    DB_USERNAME: Joi.string().default('admin'),
    DB_PASSWORD: Joi.string().default('admin'),
    DB_DIALECT: Joi.string().default('postgres'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  host: envVars.DB_HOST,
  database: envVars.DB_DATABASE,
  username: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,
  dialect: envVars.DB_DIALECT,
};
