// Описание схемы Альбомов.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;


let schema = new Schema({
  name: {
    type: String,
    unique: false,
  },
  about: {
    type: String,
  },
  created : {
    type : Date,
    default: Date.now
  },
  cover: {
    type: String,
  },
  user_id: {
    type: String,
    unique: false,
  },
  originName: {
    type: String,
  }
});

exports.Album = mongoose.model('Album', schema);