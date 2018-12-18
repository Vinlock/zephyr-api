const client = require('./discordClient');
const { gameRoles } = require('./data');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const addGuildMember = async (accessToken, userId) => {
  return client().put(`/guilds/${discordGuildId}/members/${userId}`, {
    access_token: accessToken,
  }).then(response => response.data)
};

module.exports = addGuildMember;
