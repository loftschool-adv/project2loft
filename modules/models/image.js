// Описание схемы Альбомов.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;


let schema = new Schema({
  name: {
    type: String,
    unique: false,
    required: false,
    default: "Изображение"
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
  }
});

exports.Image = mongoose.model('Image', schema);