const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, `../../.env`) });
// dotenv.config({ path: path.join(__dirname, `../../.env-${process.env.NODE_ENV}`) });

const envVarsSchema = Joi.object()
  .keys({
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DIALECT: Joi.string().default('postgres'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  db: {
    host: envVars.DB_HOST,
    name: envVars.DB_NAME,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    dialect: envVars.DB_DIALECT,
  },
};
