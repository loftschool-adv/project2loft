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
  user_id: {
    type: String,
    unique: false,
  }
});

exports.Album = mongoose.model('Album', schema);