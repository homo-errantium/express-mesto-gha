/* eslint-disable no-useless-escape */
// const validator = require('validator');
const BadRequestError = require('../../errors/BadRequestError');

module.exports.validationUrl = (url) => {
  const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  const isValidUrl = regex.test(url);
  // const isValidUrl = validator.isUrl(url);
  if (isValidUrl) {
    return url;
  }
  throw new BadRequestError('Некорректный URL');
};

module.exports.validationID = (id) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  const isValidID = regex.test(id);
  if (isValidID) {
    return id;
  }
  throw new BadRequestError('Некорректный ID');
};
