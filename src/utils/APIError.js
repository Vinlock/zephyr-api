class APIError extends Error {
  constructor(errorCode, csCode = null, errorDesc = null) {
    super(errorCode);
    this.errorCode = errorCode;
    this.csCode = csCode;
    this.errorDesc = errorDesc;
  }

  get = () => ({
    errorCode: this.errorCode,
    csCode: this.csCode,
    errorDesc: this.errorDesc,
  });
}

module.exports = APIError;
