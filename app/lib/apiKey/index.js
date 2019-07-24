const ApiKeyDb = require('../../db/models/ApiKey');

class ApiKey {
  static create = async (userId) => {
    let apiKey = new ApiKeyDb({ userId });
    apiKey = await apiKey.save();
    return apiKey.key;
  };

  static validate = async (key) => {
    const apiKey = await ApiKeyDb.findOne({ key }).exec();
    return Boolean(apiKey);
  };
}

module.exports = ApiKey;
