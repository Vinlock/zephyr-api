const asyncErrorHandler = require('../../../utils/asyncErrorHandler');

const logoutController = async (req, res) => {
  req.logger.log('session.logout', {});
  // res.cookie('zjwt_token', null);
  res.status(204).send();
};

module.exports = asyncErrorHandler(logoutController);
