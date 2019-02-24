const EventEmitter = require('events');

/**
 * Event Logger
 */
class EventLogger extends EventEmitter {

  constructor() {
    super();
    this.metaData = {};
  }

  /**
   * Log Info
   * @function
   * @param {string} type Type
   * @param {object|array|string|null} message Message
   * @fires log:info
   * @returns {void}
   */
  log = (type, message) => {
    const datetime = new Date();
    this.emit('log:info', {
      type,
      message,
      meta: this.metaData,
    }, datetime);
  };

  /**
   * Log Error
   * @function
   * @param {string} type Type
   * @param {object|array|string|number|null|undefined} message Message
   * @fires log:error
   * @returns {void}
   */
  err = (type, message) => {
    const datetime = new Date();
    this.emit('log:error', {
      type,
      message,
      meta: this.metaData,
    }, datetime);
  };

  /**
   * Alias for this.err
   * @type {LogEvents.err}
   * @alias error
   */
  error = this.err;

  /**
   * Log Warning
   * @function
   * @param {string} type Type
   * @param {object|array|string|number|null|undefined} message Message
   * @fires log:warn
   * @returns {void}
   */
  warn = (type, message) => {
    const datetime = new Date();
    this.emit('log:warn', {
      type,
      message,
      meta: this.metaData,
    }, datetime);
  };

  /**
   * Warning Log Listener
   * @function
   * @param {function} callback Callback
   * @listens log:warn
   * @returns {void}
   */
  onWarn = (callback) => {
    this.on('log:warn', callback);
  };

  /**
   * Error Log Listener
   * @function
   * @param {function} callback Callback
   * @listens log:error
   * @returns {void}
   */
  onError = (callback) => {
    this.on('log:error', callback);
  };

  /**
   * Log Info Listener
   * @function
   * @param {function} callback Callback
   * @listens log:info
   * @returns {void}
   */
  onLog = (callback) => {
    this.on('log:info', callback);
  };

  /**
   * Log On Specific Type
   * @param {string} type Type
   * @param {function} callback Function Callback
   * @returns {void}
   * @listens {type}
   * @function
   */
  onType = (type, callback) => {
    const cb = (message) => {
      if (message.type === type) {
        callback(message);
      }
    };
    this.on('log:info', cb);
    this.on('log:warn', cb);
    this.on('log:error', cb);
  };

  /**
   * Append Metadata
   * @function
   * @param {string} key Key
   * @param {object|array|string|number|null} value Value
   * @returns {void}
   */
  appendMeta = (key, value) => {
    this.metaData[key] = value;
  };
}

module.exports = EventLogger;