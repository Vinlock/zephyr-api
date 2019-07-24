const asyncErrorHandler = require('../../../utils/asyncErrorHandler');
const { gameRoles, langRoles } = require('../../../lib/discord/enums');

const USER_AVATAR_TEMPLATE = (userId, avatar) => `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;

const getProfile = async (req, res, next) => {
  try {
    let user = await req.user
      .populate('discord')
      .populate('profile')
      .execPopulate();
    const userData = await req.discord.getGuildMember(user.discord.id);
    const { roles } = userData;
    const { username, discriminator } = userData.user;
    let result = {};
    // User Data
    const name = userData.nick || username;
    result.username = `${name}#${discriminator}`;
    result.admin = await req.user.isAdmin() ? true : undefined;
    result.legionMember = await req.user.isLegionMember();
    result.avatar = USER_AVATAR_TEMPLATE(user.discord.id, userData.user.avatar);
    const guildRoles = await req.discord.getGuildRoles();
    result.roles = {
      games: {},
      langs: {},
      all: guildRoles.filter(role => roles.includes(role.id)),
    };
    // Game Roles
    Object.keys(gameRoles).forEach((game) => {
      result.roles.games[game] = roles.includes(gameRoles[game]);
    });
    // Lang Roles
    Object.keys(langRoles).forEach((lang) => {
      result.roles.langs[lang] = roles.includes(langRoles[lang]);
    });

    // Profile
    req.logger.log('req.user.profile', req.user.profile);
    const profile = req.user.profile;
    result.profile = {
      twitchUsername: profile.twitch,
    };

    // Response
    res.json({
      ...result,
      discordId: user.discord.id,
      userId: user._id,
    });
  } catch (err) {
    if (err.message === 'MEMBER_NOT_FOUND') {
      err.errorCode = 'MEMBER_NOT_FOUND';
    }
    return next(err);
  }
};

const updateProfileGame = async (req, res, next) => {
  const user = await req.user.populate('discord').execPopulate();
  const discordId = user.discord.id;
  const { game } = req.params;
  const { value } = req.body;
  const success = await req.discord.updateGame(discordId, game, value);
  if (success) {
    const games = await req.discord.getGames(discordId);
    return res.json(games);
  }
};

const updateProfileLanguage = async (req, res) => {
  const user = await req.user.populate('discord').execPopulate();
  const discordId = user.discord.id;
  const { language } = req.params;
  const { value } = req.body;
  const success = await req.discord.updateLanguage(discordId, language, value);
  if (success) {
    const langs = await req.discord.getLangs(discordId);
    return res.json(langs);
  }
};

const updateTwitchStream = async (req, res) => {
  const user = await req.user.populate('profile').execPopulate();
  user.profile.twitch = req.body.twitchUsername;
  user.profile.save(() => {
    res.json({
      success: true,
    });
  });
};

module.exports = {
  getProfile: asyncErrorHandler(getProfile),
  updateProfileGame: asyncErrorHandler(updateProfileGame),
  updateProfileLanguage: asyncErrorHandler(updateProfileLanguage),
  updateTwitchStream: asyncErrorHandler(updateTwitchStream),
};
