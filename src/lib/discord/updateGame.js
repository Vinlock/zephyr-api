const client = require('./discordClient');
const { gameRoles } = require('./data');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const updateGame = async (userId, game, value) => {
  const data = await client().get(`/guilds/${discordGuildId}/members/${userId}`)
    .then(response => response.data);
  let { roles } = data;
  if (value) {
    if (!roles.includes(gameRoles[game])) {
      roles.push(gameRoles[game]);
    }
  } else {
    roles = roles.filter(role => {
      return role !== gameRoles[game];
    });
  }
  try {
    const endpoint = `/guilds/${discordGuildId}/members/${userId}`;
    const result = await client().patch(endpoint, {
      roles,
    });
    return result.status === 204;
  } catch (err) {
    return false;
  }
};

module.exports = updateGame;
