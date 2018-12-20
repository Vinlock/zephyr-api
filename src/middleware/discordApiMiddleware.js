const DiscordClient = require('../lib/discord/discordClient');

const discordMiddleware = () => (req, res, next) => {
  req.discord = new DiscordClient();
  req.discord.eventLogger.onLog((type, message) => {
    req.logger.log(type, message);
  });
  req.discord.eventLogger.onWarn((type, message) => {
    req.logger.warn(type, message);
  });
  req.discord.eventLogger.onError((type, message) => {
    req.logger.error(type, message);
  });
  return next();
};

module.exports = discordMiddleware;
