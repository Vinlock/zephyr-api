const toDashCase = (string) => {
  let result = string.toLowerCase();
  result = result.split(' ').join('-');
  if (result.indexOf('_') > -1) {
    result = result.split('_').join('-');
  }
  return result;
};

module.exports = toDashCase;
