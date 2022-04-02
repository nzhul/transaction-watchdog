'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Filter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Filter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      token: DataTypes.STRING,
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      minAmount: DataTypes.FLOAT,
      maxAmount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Filter',
    }
  );
  return Filter;
};
