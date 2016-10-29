// Описание схемы Альбомов.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;


let schema = new Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    default: "Альбом"
  },
  about: {
    type: String,
    required: false,
    default: "Об альбоме"
  },
  created : {
    type : Date,
    default: Date.now
  },
  user_id: {
    type: String,
    unique: false,
    required: true
  }
});

exports.Album = mongoose.model('Album', schema);