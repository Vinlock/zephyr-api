const axios = require('axios');

const validTopicArns = {
  'discord-message': 'arn:aws:sns:us-west-2:626986745141:discord-message',
};

const sns = () => (req, res, next) => {
  const { headers } = req;
  let { body } = req;
  const messageType = headers['x-amz-sns-message-type'];
  body = JSON.parse(body);

  if (messageType === 'SubscriptionConfirmation') {
    // If invalid ARN
    if (!Object.values(validTopicArns).includes(body.TopicArn)) {
      return res.status(403).send(null);
    } else {
      return axios({
        url: body.SubscribeURL,
        method: 'get',
      }).then(function (response) {
        req.logger.log('sns.confirm.response', response.data);
        return res.status(204);
      }).catch(function (err) {
        req.logger.err('sns.error', err);
        throw err;
      });
    }
  } else if (messageType === 'Notification') {
    if (body.TopicArn === validTopicArns['discord-message']) {
      if (JSON.parse(body.Message).channelId === '326507689356165120') {
        req.io.emit('discordLobbyMessage', {

        })
      }
    }
  }
};

const discord = () => (req, res, next) => {
  next();
};

module.exports = {
  sns,
  discord,
};