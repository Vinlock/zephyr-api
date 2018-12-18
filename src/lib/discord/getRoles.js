const client = require('./discordClient');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const getRoles = async (userId) => {
  return client().get(`/guilds/${discordGuildId}/members/${userId}`)
    .then(response => response.data)
    .then(data => data.roles)
    .catch((err) => {
      if (err.response.status === 404) {
        Promise.reject(new Error('MEMBER_NOT_FOUND'));
      } else {
        Promise.reject(err);
      }
    });
};

module.exports = getRoles;
