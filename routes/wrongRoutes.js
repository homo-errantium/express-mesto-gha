const wrongRouter = require('express').Router();
const { getWrongRouter } = require('../controllers/wrongRoutes');

wrongRouter.get('*', getWrongRouter);

module.exports = { wrongRouter };
