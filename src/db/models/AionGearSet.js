const mongoose = require('mongoose');

const { Schema } = mongoose;

const aionGearSet = new Schema({
  hp: {
    type: Number,
  },
  mp: {
    type: Number,
  },
  physicalAttack: {
    type: Number,
  },
  magicAttack: {
    type: Number,
  },
  physicalDefense: {
    type: Number,
  },
  magicDefense: {
    type: Number,
  },
  pveAttack: {
    type: Number,
  },
});