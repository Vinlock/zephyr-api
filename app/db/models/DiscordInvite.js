const mongoose = require('mongoose');
const moment = require('moment');
import db from '../db';

const { Schema } = mongoose;

const discordInviteSchema = new Schema({
  id: {
    type: String,
    require: false,
    default: () => [...Array(5)]
      .map(()=>(~~(Math.random()*36)).toString(36)).join(''),
    unique: true,
  },
  expires: {
    type: Date,
    require: false,
    default: () => moment().add(3, 'hours').toDate(),
  },
  creator: {
    type: Schema.ObjectId,
    require: true,
  },
  user: {
    type: Schema.ObjectId,
    require: false,
    default: null,
    nullable: true,
  }
});

const DiscordInvite = db.model('DiscordInvite', discordInviteSchema);

module.exports = DiscordInvite;
