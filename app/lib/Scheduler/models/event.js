const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  creator: {
    type: mongoose.Schema.ObjectId,
    require: true,
    unique: false,
  },
  title: {
    type: String,
    require: true,
    unique: false,
  },
  eventStart: {
    type: Date,
    require: true,
  },
  eventEnd: {
    type: Date,
    require: false,
    default: null,
  },
  description: {
    type: String,
    require: false,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    require: false,
  },
  questions: {
    type: [String],
    default: [],
    require: false,
  },
});

const SchedulerEvent = mongoose.model('SchedulerEvent', eventSchema);

module.exports = SchedulerEvent;
