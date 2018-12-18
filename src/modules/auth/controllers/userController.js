const asyncErrorHandler = require('../../../utils/asyncErrorHandler');

const userController = async (req, res, next) => {
  if (req.user) {
    return res.json({
      username: req.user.username,
      admin: await req.user.isAdmin() ? true : undefined,
      legionMember: await req.user.isLegionMember(),
    });
  } else {
    return next(new Error('INVALID_SESSION'));
  }
};

module.exports = asyncErrorHandler(userController);
