// Описание схемы Социальных Сетей.
'use strict';

let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;

let schema = new Schema({
  user_id : {
    type: Number,
    unique: false,
  },
  vk: {
     name: {
      type: String,
      default: "Вконтакте"
     },
     link: {
      type: String,
      default: "Вконтакте",
     }
  },
  google: {
     name: {
      type: String,
      default: "Google+"
     },
     link: {
      type: String,
      default: "Google+"
     }
  },
  twitter: {
     name: {
      type: String,
      default: "Twitter"
     },
     link: {
      type: String,
      default: "Twitter"
     }
  },
  facebook: {
     name: {
      type: String,
      default: "Facebook"
     },
     link: {
      type: String,
      default: "Facebook"
     }
  }
  
});


exports.Social = mongoose.model('Social', schema);