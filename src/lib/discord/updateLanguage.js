const client = require('./discordClient');
const { langRoles } = require('./data');

const discordGuildId = process.env.DISCORD_GUILD_ID;

const updateLang = async (userId, lang, value) => {
  const data = await client().get(`/guilds/${discordGuildId}/members/${userId}`)
    .then(response => response.data);
  let { roles } = data;
  if (value) {
    if (!roles.includes(langRoles[lang])) {
      roles.push(langRoles[lang]);
    }
  } else {
    roles = roles.filter(roles => {
      return roles !== langRoles[lang];
    });
  }
  try {
    const endpoint = `/guilds/${discordGuildId}/members/${userId}`;
    const result = await client().patch(endpoint, {
      roles
    });
    return result.status === 204;
  } catch (err) {
    return false;
  }
};

module.exports = updateLang;
