const JWTKMS = require('jwt-kms');

const jwt = new JWTKMS({
  aws: {
    region: "us-east-1",
  },
});

module.exports = jwt;
