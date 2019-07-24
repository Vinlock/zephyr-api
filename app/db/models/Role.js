const mongoose = require('mongoose');
import db from '../';

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true,
    min: 3,
    max: 20,
  },
  description: {
    type: String,
    require: false,
    default: '',
  },
});

const Role = db.model('Role', roleSchema);

module.exports = Role;
