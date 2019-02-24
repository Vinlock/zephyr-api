const asyncErrorHandler = (handler) => async (req, res, next) => {
  try {
    return await handler(req, res, next);
  } catch (err) {
    return next(err);
  }
};

module.exports = asyncErrorHandler;
