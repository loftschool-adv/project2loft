// Описание схемы пользователей.

'use strict';

let crypto = require('crypto');
let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;


let schema = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    salt : {
       type: String,
       required: true
    },
    hashedpassword : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    created : {
        type : Date,
        default: Date.now
    },
    name: {
        type: String,
        required: false,
        default: "Пользователь"
    },
    about: {
        type: String,
        required: false,
        default: "Обо мне"
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function(password){
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedpassword = this.encryptPassword(password);
    })
    .get(function(){ return this._plainPassword; });

schema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hashedpassword;
};

exports.User = mongoose.model('User', schema);