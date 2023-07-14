const wrongRouter = require('express').Router();
const { getWrongRouter } = require('../controllers/wrongRoutes');

wrongRouter.use('*', getWrongRouter);

module.exports = { wrongRouter };
