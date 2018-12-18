const axios = require('axios');

const botToken = process.env.DISCORD_BOT_TOKEN;

const client = () => axios.create({
  baseURL: 'https://discordapp.com/api',
  timeout: 10000,
  headers: {
    Authorization: `Bot ${botToken}`,
  },
});

module.exports = client;
