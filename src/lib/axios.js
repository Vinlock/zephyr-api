const axios = require('axios');

const _logRequest = (request) => {
  const requestLog = {
    timeout: request.timeout || null,
    headers: request.headers || null,
    method: request.method || null,
    baseURL: request.baseURL || null,
    path: request.url || null,
    url: `${request.baseURL}${request.url}` || null,
  };
  if (request.data) {
    try {
      requestLog.data = JSON.parse(request.data);
    } catch (err) {
      requestLog.data = request.data || null;
    }
  }

  this.logger.log('request', {
    request: requestLog,
    additionalData: this.additionalData,
  });

  return request;
};

const _logRequestError = (error) => {
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

  this.logger.err('request.error', {
    error: requestErrorLog,
    additionalData: this.additionalData,
  });

  return Promise.reject(error);
};

const _logResponse = (response) => {
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

  this.logger.log('response', {
    response: responseLog,
    additionalData: this.additionalData,
  });

  return response;
};

const _logResponseError = (error) => {
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

  this.logger.err('response.error', {
    error: responseErrorLog,
    additionalData: this.additionalData,
  });

  return Promise.reject(error);
};

const create = (options) => {
  const instance = axios.create(options);

  // Logging Interceptors
  instance.interceptors.request.use(_logRequest, _logRequestError);
  instance.interceptors.response.use(_logResponse, _logResponseError);

  return instance;
};

module.exports = create;
