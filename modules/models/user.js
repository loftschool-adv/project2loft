// Описание схемы пользователей.

'use strict';

let crypto = require('crypto');
let mongoose = require('./../libs/mongoose.js');
let Schema = mongoose.Schema;
let autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);



let schema = new Schema({
    name: {
        type: String,
        required: true,
        default: "Пользователь"
    },
    user_id : {
        type: Number,
        unique: false,
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
        unique: true,
        required: true
    },
    created : {
        type : Date,
        default: Date.now
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

schema.methods.createId = function(){
    return Math.random();
}


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

schema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'user_id',
    startAt: 1,
});



exports.User = mongoose.model('User', schema);