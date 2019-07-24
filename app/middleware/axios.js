const axios = require('axios');

const _logRequest = (logger) => (request) => {
  const requestLog = {
    timeout: request.timeout || null,
    headers: request.headers || null,
    method: request.method || null,
    baseURL: request.baseURL || null,
    path: request.url || null,
    url: `${request.baseURL}${request.url}` || null,
    session: request.session,
  };
  if (request.data) {
    try {
      requestLog.data = JSON.parse(request.data);
    } catch (err) {
      requestLog.data = request.data || null;
    }
  }

  logger.log('request', {
    request: requestLog,
  });

  return request;
};

const _logRequestError = (logger) => (error) => {
  const requestErrorLog = {
    response: {
      data: error.response.data || null,
      status: error.response.status || null,
      headers: error.response.headers || null,
    },
    request: {
      headers: error.request.headers || null,
      url: error.request.url || null,
      data: error.request.data || null,
    },
    error: {
      message: error.message || null,
    },
  };

  logger.error('request.error', {
    error: requestErrorLog,
  });

  return Promise.reject(error);
};

const _logResponse = (logger) => (response) => {
  const responseLog = {
    response: {
      status: response.status || null,
      statusText: response.statusText || null,
      headers: response.headers || null,
      data: response.data || null,
      time: response.time || null,
    },
    request: {
      headers: response.request.headers || null,
      method: response.config.method || null,
      baseURL: response.config.baseURL || null,
      url: response.config.url || null,
      data: response.config.data || null,
    },
  };

  logger.log('response', {
    response: responseLog,
  });

  return response;
};

const _logResponseError = (logger) => (error) => {
  const responseErrorLog = {};

  if (error.response !== undefined) {
    responseErrorLog.response = {
      data: error.response.data || null,
      status: error.response.status || null,
      headers: error.response.headers || null,
      time: error.response.time || null,
    };
  }

  responseErrorLog.request = {};
  if (error.request) {
    responseErrorLog.request = {
      headers: error.request.headers || error.config.headers || null,
      host: error.config.baseURL || null,
      url: error.config.url || null,
      path: error.request.path || null,
      method: error.config.method || null,
      timeout: error.config.timeout || null,
    };
    try {
      responseErrorLog.request.data = JSON.parse(error.config.data);
    } catch (err) {
      responseErrorLog.request.data = error.config.data || null;
    }
  }

  responseErrorLog.error = {
    message: error.message || null,
  };

  logger.error('response.error', {
    error: responseErrorLog,
  });

  return Promise.reject(error);
};

const axiosMiddleware = () => async (req, res, next) => {
  req.axios = (options) => {
    const instance = axios.create(options);

    // Logging Interceptors
    instance.interceptors.request.use(_logRequest(req.logger), _logRequestError(req.logger));
    instance.interceptors.response.use(_logResponse(req.logger), _logResponseError(req.logger));

    return instance;
  };

  return next();
};

module.exports = axiosMiddleware;
