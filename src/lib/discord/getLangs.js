const client = require('./discordClient');
const { langRoles } = require('./data');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const getLangs = async (userId) => {
  return client().get(`/guilds/${discordGuildId}/members/${userId}`)
    .then(response => response.data)
    .then((data) => {
      const result = {};
      Object.keys(langRoles).forEach((lang) => {
        result[lang] = data.roles.includes(langRoles[lang]);
      });
      return result;
    });
};

module.exports = getLangs;
