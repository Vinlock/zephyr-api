const getGames = require('../../../lib/discord/getGames');
const getLangs = require('../../../lib/discord/getLangs');
const getGuildMember = require('../../../lib/discord/getGuildMember');
const updateGame = require('../../../lib/discord/updateGame');
const updateLang = require('../../../lib/discord/updateLanguage');
const asyncErrorHandler = require('../../../utils/asyncErrorHandler');
const { gameRoles, langRoles } = require('../../../lib/discord/data');

const getProfile = async (req, res, next) => {
  try {
    let user = await req.user
      .populate('discord')
      .populate('profile')
      .execPopulate();
    const userData = await getGuildMember(user.discord.id);
    const { roles } = userData;
    const { username, discriminator } = userData.user;
    let result = {};
    // User Data
    result.username = `${username}#${discriminator}`;
    result.admin = await req.user.isAdmin() ? true : undefined;
    result.legionMember = await req.user.isLegionMember();
    result.roles = {
      games: {},
      langs: {},
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
    const profile = req.user.profile;
    result.profile = {
      twitchUsername: profile.twitch,
    };

    // Response
    res.json(result);
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
  const success = await updateGame(discordId, game, value);
  if (success) {
    const games = await getGames(discordId);
    return res.json(games);
  }
};

const updateProfileLanguage = async (req, res) => {
  const user = await req.user.populate('discord').execPopulate();
  const discordId = user.discord.id;
  const { language } = req.params;
  const { value } = req.body;
  const success = await updateLang(discordId, language, value);
  if (success) {
    const langs = await getLangs(discordId);
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
