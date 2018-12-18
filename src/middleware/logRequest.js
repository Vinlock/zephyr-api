/**
 * Log Express Request
 * @returns {Function} Express Middleware
 */
const logRequest = () => (req, res, next) => {
  // Client Generated X-REQUEST-ID Header Logging
  if (Object.prototype.hasOwnProperty.call(req.headers, 'x-request-id')) {
    req.logger.addMetadata('clientRequestId', req.headers['x-request-id']);
  }

  // Log Request
  req.logger.log('client.request', {
    headers: req.headers,
    method: req.method,
    params: req.params,
    query: req.query,
    body: req.body,
    path: req.path,
    signedCookies: req.signedCookies,
    originalUrl: req.originalUrl,
    protocol: req.protocol,
    baseUrl: req.baseUrl,
    ip: req.ipAddress,
    route: req.route,
    secure: req.secure,
  });

  return next();
};

module.exports = logRequest;