const asyncErrorHandler = require('../../../utils/asyncErrorHandler');

const logoutController = async (req, res) => {
  req.logger.log('session.logout', {});
  const cookieOptions = {
    domain: process.env.COOKIE_DOMAIN,
  };
  res.cookie('zjwt', null, cookieOptions);
  res.json({});
};

module.exports = asyncErrorHandler(logoutController);
