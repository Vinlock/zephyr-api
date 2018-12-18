const client = require('./discordClient');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const listGuildMembers = (limit = 1, after = 0) => {
  const params = {
    limit, after,
  };
  return client().get(`/guilds/${discordGuildId}/members`, { params })
    .then(response => response.data);
};

module.exports = listGuildMembers;
