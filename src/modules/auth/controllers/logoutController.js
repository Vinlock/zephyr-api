const asyncErrorHandler = require('../../../utils/asyncErrorHandler');

const logoutController = async (req, res) => {
  res.cookie('zjwt', null);
  console.log('cookie deleted');
  res.json({});
};

module.exports = asyncErrorHandler(logoutController);
