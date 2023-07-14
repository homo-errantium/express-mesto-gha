const wrongRouter = require('express').Router();
const { getWrongRouter } = require('../controllers/wrongRoutes');

wrongRouter.get('*', getWrongRouter);
wrongRouter.patch('*', getWrongRouter);

module.exports = { wrongRouter };
