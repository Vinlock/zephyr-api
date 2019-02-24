const winston = require('winston');
const CircularJSON = require('circular-json');

class Logger {
  constructor(metadata = {}) {
    this.metadata = Object.assign({}, metadata);
    this.logFormat = winston.format.printf((info) => {
      let { message } = info;
      if (typeof message === 'object') {
        message = CircularJSON.stringify(message);
      }
      return `${info.level}: ${message}`;
    });
    this.winstonOptions = {
      level: 'info',
      format: winston.format.combine(this.logFormat),
      transports: [
        new winston.transports.Console(),
      ],
    };
    this.winston = winston.createLogger(this.winstonOptions);
  }

  addMetadata = (key, value) => {
    if (typeof key === 'object') {
      this.metadata = Object.assign(this.metadata, key);
    } else {
      this.metadata[String(key)] = value;
    }
    return this;
  };

  removeMetadata = (key) => {
    delete this.metadata[String(key)];
    return this;
  };

  _messageFormat = (type, message) => {
    return {
      type,
      message,
      meta: this.metadata,
    };
  };

  log = (type, message) => {
    this.winston.log({
      level: 'info',
      message: this._messageFormat(type, message),
    });
  };

  warn = (type, message) => {
    this.winston.log({
      level: 'warn',
      message: this._messageFormat(type, message),
    });
  };

  error = (type, message) => {
    this.winston.log({
      level: 'error',
      message: this._messageFormat(type, message),
    });
  };

  debug = (type, message) => {
    if (process.env.DEBUG_MODE && process.env.DEBUG_MODE === 'true') {
      this.winston.log({
        level: 'info',
        message: this._messageFormat(type, message),
      });
    }
  };

  err = this.error;

  getLogger = () => this.winston;
}

module.exports = Logger;
