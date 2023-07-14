const wrongRouter = require('express').Router();
const { getWrongRouter } = require('../controllers/wrongRoutes');

wrongRouter.get('*', getWrongRouter);
wrongRouter.post('*', getWrongRouter);
wrongRouter.put('*', getWrongRouter);
wrongRouter.patch('*', getWrongRouter);
wrongRouter.delete('*', getWrongRouter);

module.exports = { wrongRouter };
