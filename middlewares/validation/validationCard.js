const { celebrate, Joi } = require('celebrate');
const { validationUrl, validationID } = require('./validationFunctions');

module.exports.validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(validationUrl),
  }),
});

module.exports.validationCardID = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(validationID),
  }),
});
