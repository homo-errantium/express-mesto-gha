const { NOT_FOUND_CODE } = require('../utils/constants');

module.exports.getWrongRouter = (req, res, next) => {
  res.status(NOT_FOUND_CODE).send('Запрашиваемый ресурс не найден');
  next();
};
