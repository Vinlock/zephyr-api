const mongoose = require('mongoose');

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

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
