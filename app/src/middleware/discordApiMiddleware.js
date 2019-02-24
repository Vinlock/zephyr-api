const DiscordClient = require('../lib/discord/discordClient');

const discordMiddleware = () => (req, res, next) => {
  req.discord = new DiscordClient();
  req.discord.eventLogger.onLog((m) => {
    req.logger.log(m.type, m.message);
  });
  req.discord.eventLogger.onWarn((m) => {
    req.logger.warn(m.type, m.message);
  });
  req.discord.eventLogger.onError((m) => {
    req.logger.error(m.type, m.message);
  });
  return next();
};

module.exports = discordMiddleware;
