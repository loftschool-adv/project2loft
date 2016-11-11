// Описание схемы Альбомов.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

let schema = new Schema({
  img_id : {
    type: Number,
    unique: false,
  },
  name: {
    type: String,
    unique: false,
    required: false,
  },
  src: {
    type: String,
    unique: false,
    required: false,
  },
  created : {
    type : Date,
    default: Date.now
  },
  album: {
    type: String,
    unique: false,
    required: false
  },
  user_id: {
    type: String,
    unique: false,
    required: false
  },
  cover: {
    type: Number,
    default: 0
  }
});

schema.plugin(autoIncrement.plugin, {
  model: 'Image',
  field: 'img_id',
  startAt: 1,
});


exports.Image = mongoose.model('Image', schema);