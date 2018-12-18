const client = require('./discordClient');
const { gameRoles } = require('./data');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const getGames = async (userId) => {
  return client().get(`/guilds/${discordGuildId}/members/${userId}`)
    .then(response => response.data)
    .then((data) => {
      const result = {};
      Object.keys(gameRoles).forEach((game) => {
        result[game] = data.roles.includes(gameRoles[game]);
      });
      return result;
    });
};

module.exports = getGames;
