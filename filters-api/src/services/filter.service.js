const db = require('../database');

const getFilter = async (id) => {
  return await db.Filter.findOne({
    where: { id: id },
  });
};

module.exports = {
  getFilter,
};
