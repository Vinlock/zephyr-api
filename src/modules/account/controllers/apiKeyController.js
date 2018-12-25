const asyncErrorHandler = require('../../../utils/asyncErrorHandler');
const ApiKey = require('../../../lib/apiKey/index');

const create = async (req, res) => {
    res.json({
      apiKey: await ApiKey.create(req.user._id),
    });
};

module.exports = {
  create: asyncErrorHandler(create),
};
