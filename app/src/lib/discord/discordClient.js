const axios = require('axios');
const EventLogger = require('../logEvents');
const interceptors = require('../axiosInterceptors');
const enums = require('./enums');
const EventEmitter = require('events');
const DiscordConnection = require('../../db/models/DiscordConnection');
const yup = require('yup');
const { intToHex } = require('./colorConvert');

const botToken = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;

const refreshEventHandler = new EventEmitter();
refreshEventHandler.on('refreshed', (data) => {
  DiscordConnection.updateConnection(
    data.currentAccessToken,
    data.currentRefreshToken,
    data.accessToken,
    data.refreshToken,
  );
});

class DiscordClient {
  constructor() {
    this.eventLogger = new EventLogger();
    this.accessToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  processQueue = (error, token = null) => {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    this.failedQueue = [];
  };

  userIsAssociated = () => this.accessToken !== null;

  associateUser = (accessToken, refreshToken) => {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  };

  request = (options = {}) => {
    const schema = yup.object().shape({
      bot: yup.boolean().default(true),
      token: yup.string().default(botToken),
      type: yup.string(),
    });
    schema.validateSync(options);
    options = Object.assign(options, schema.cast());

    let authorizationHeader = `Bot ${options.token}`;
    if (!options.bot) {
      authorizationHeader = `Bearer ${options.token}`;
    }

    const config = {
      baseURL: 'https://discordapp.com/api',
      timeout: 10000,
      headers: {
        Authorization: authorizationHeader,
      },
    };

    // Add cache adapter.

    const instance = axios.create(config);

    const type = options.type ? `.${options.type}` : '';
    const logRequest = request => this.eventLogger.log(`discord.request${type}`, request);
    const logRequestError = requestError => this.eventLogger.error(`discord.request.error${type}`, requestError);
    const logResponse = response => this.eventLogger.log(`discord.response${type}`, response);
    const logResponseError = responseError => this.eventLogger.log(`discord.response.error${type}`, responseError);

    // Logging Interceptors
    instance.interceptors.request.use(interceptors._logRequest(logRequest), interceptors._logRequestError(logRequestError));
    instance.interceptors.response.use(interceptors._logResponse(logResponse), interceptors._logResponseError(logResponseError));

    // Refresh Token Interceptor
    instance.interceptors.response.use(response => response, (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          }).catch(err => err);
        }
        originalRequest._retry = true;
        this.isRefreshing = true;

        return new Promise((resolve, reject) => {
          axios.post('https://discordapp.com/api/oauth2/token', {
            refreshToken: this.refreshToken,
          }).then(({ data }) => {
            refreshEventHandler.emit('refreshed', {
              currentAccessToken: this.accessToken,
              currentRefreshToken: this.refreshToken,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            });
            originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
            this.processQueue(null, data.access_token);
            resolve(axios(originalRequest));
          }).catch((err) => {
            this.processQueue(err, null);
            reject(err);
          }).then(() => {
            this.isRefreshing = false;
          });
        });
      }
      return Promise.reject(error);
    });

    return instance;
  };

  eventLogger = () => this.eventLogger;

  getGuildMember = async userId => this.request({
    type: 'getGuildMember',
  }).get(`/guilds/${guildId}/members/${userId}`)
    .then(response => response.data)
    .catch((err) => {
      if (err.response.status === 404) {
        Promise.reject(new Error('MEMBER_NOT_FOUND'))
      } else {
        Promise.reject(err);
      }
    });

  getMessage = async (channelId, messageId) => this.request({
    type: 'getMessage',
  }).get(`/channels/${channelId}/messages/${messageId}`)
    .then(response => response.data)
    .catch((err) => {
      if (err.response.status === 404) {
        Promise.reject(new Error('MESSAGE_NOT_FOUND'));
      } else {
        Promise.reject(err);
      }
    });

  getGames = async userId => this.getGuildMember(userId)
    .then((member) => {
      const result = {};
      Object.keys(enums.gameRoles).forEach((game) => {
        result[game] = member.roles.includes(enums.gameRoles[game]);
      });
      return result;
    });

  getLangs = async userId => this.getGuildMember(userId)
    .then((member) => {
      const result = {};
      Object.keys(enums.langRoles).forEach((lang) => {
        result[lang] = member.roles.includes(enums.langRoles[lang]);
      });
      return result;
    });

  listGuildMembers = (limit = 1, after = 0) => {
    const params = {limit, after};
    return this.request({
      type: 'listGuildMembers',
    }).get(`/guilds/${discordGuildId}/members`, {params})
      .then(response => response.data);
  };

  updateRoles = async (userId, newRoles) => this.request({
    type: 'updateRoles',
  }).patch(`/guilds/${guildId}/members/${userId}`, {
      roles: newRoles,
    }).then(response => response.status === 204);

  updateGame = async (userId, game, value) => {
    const member = await this.getGuildMember(userId);
    let {roles} = member;
    if (value) {
      if (!roles.includes(enums.gameRoles[game])) {
        roles.push(enums.gameRoles[game]);
      }
    } else {
      roles = roles.filter(role => role !== enums.gameRoles[game]);
    }
    try {
      return await this.updateRoles(userId, roles);
    } catch (err) {
      return false;
    }
  };

  updateLanguage = async (userId, lang, value) => {
    const member = await this.getGuildMember(userId);
    let {roles} = member;
    if (value) {
      if (!roles.includes(enums.langRoles[lang])) {
        roles.push(enums.langRoles[lang]);
      }
    } else {
      roles = roles.filter(role => role !== enums.langRoles[lang]);
    }
    try {
      return await this.updateRoles(userId, roles);
    } catch (err) {
      return false;
    }
  };

  addGuildMember = async (accessToken, userId) => this.request()
    .put(`/guilds/${guildId}/members/${userId}`, {
      access_token: accessToken,
    }).then(response => response.data);

  getGuildRoles = async () => this.request()
    .get(`/guilds/${guildId}/roles`)
    .then(response => response.data)
    .then(data => data.map(role => ({
      ...role,
      color: intToHex(role.color),
    })));

  addRoleToUser = async (userId, roleId) => this.request({
    type: 'addRoleToUser',
  }).put(`/guilds/${guildId}/members/${userId}/roles/${roleId}`)
    .then(response => response.data);

}

module.exports = DiscordClient;
