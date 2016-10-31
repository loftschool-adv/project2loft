// Описание схемы Альбомов.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;


let schema = new Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    default: "Изображение"
  },
  src: {
    type: String,
    unique: false,
    required: true,
  },
  created : {
    type : Date,
    default: Date.now
  },
  album_id: {
    type: objectId,
    unique: false,
    required: true
  },
  user_id: {
    type: objectId,
    unique: false,
    required: true
  }
});

exports.Image = mongoose.model('Image', schema);