// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';

let fs = require('fs');
let express = require('express');
let route = require('express').Router();
let async = require('async');
let sendMail = require('../modules/send-mail.js');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let config = require('../config.json');
let folder = './' + config.folder.users;  // Папка с пользователями
let User = require('../modules/models/user.js').User;

let mongoose = require('../modules/libs/mongoose.js');


let sendMasage = function (message, res, status = 0) {
  res.json(
    {
      message: message,
      status: status
    })
};



// Отображение главной страницы
route.get('/', (req, res) => {
  if (!req.session.email) {
    res.render('index');
  } else {
    res.redirect(`/id${req.session.user_id}/`);
  }
});



// Регистрация новых пользоватей
route.post('/reg/', (req, res) => {
  // Передаем данные в модуль регистрации
  require('../modules/registration.js')(req, res);
});


// Вход на сайт 
route.post('/login/', (req, res) => {
  let User = require('../modules/models/user.js').User;


  User.findOne({'email': req.body.email}).then((item) => {
    if (item) {

      if (item.checkPassword(req.body.pass)) {

        req.session.user_id = item.user_id;
        req.session.email = item.email;
        req.session.name = item.name;
        req.session.about = item.about;

        res.send({status: 'login'});
      }
      else {
        return sendMasage('Данные не верные', res, 0);
      }

    } else {
      console.log("Такой пользователь НЕ найден");
      res.send({});
    }
  });

});



// Васстоновление пароля
route.post('/recover/', (req, res) => {
  let User = require('../modules/models/user.js').User;
  let pass =  "" + base.passGenerate(8);
  User.findOne({'email': req.body.email}).then((user) => {
    if(!user){
      return sendMasage('Такой пользователь не найден', res , 0);
    }
    user.update({
      hashedpassword : user.encryptPassword(pass)
    },(err) => {if (err) throw err })
    
    sendMail(req.body.email, 'Восстановление пароля', 'Новый пароль: ' + pass)
    return sendMasage('Сообщение отправленно', res , 1);
  })
});

module.exports = route;