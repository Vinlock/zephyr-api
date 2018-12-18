const uuid = require('uuid/v4');

/**
 * Server Request ID Generator
 * @return {void}
 */
const requestIdGenerator = () => (req, res, next) => {
  req.serverRequestId = uuid();
  res.set({ 'x-nc-request-id': req.serverRequestId });
  req.logger.addMetadata('serverRequestId', req.serverRequestId);
  return next();
};

module.exports = requestIdGenerator;
