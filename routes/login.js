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
  async.waterfall([
    // Запускаем функции
    function(callback){
      // Ищем пользователя по email
      User.findOne({'email': req.body.email},callback)
    },
    function(user,callback){
      // Если находим, выдаем ошибку
      if(user){
        callback('Такой email уже зарегитрирован')
      }else{
        // Если не находим, продолжаем работу
        callback();
      }
    },
    function(callback){
      // Создаем модель пользователя для сохранения
      let user = new User({
        name: req.body.login,
        password: req.body.pass,
        email: req.body.email
      });
      req.session.user_id = user.user_id;
      req.session.email = user.email;
      // Сохраняем пользователя
      user.save(callback)
    },
    function(user,affected,callback){
      // Записываем данные сохраненного пользователя в сессию
      req.session.user_id = user.user_id;
      req.session.email = user.email;
      callback(null,user);
    },
    function(user,callback){
      // Создаем папку tmp
      let userFolder = folder + '/id' + user.user_id;
      async.parallel([
        function(callback_2){
          // Создаем папку пользователя
          base.folderGenerator(userFolder,callback_2);
        },
        function(callback_2){
          // Создаем папку tmp
          base.folderGenerator(userFolder + '/' + config.folder.tmp,callback_2);
        },
        function(callback_2){
          // Создаем папку albums
          base.folderGenerator(userFolder + '/' + config.folder.albums,callback_2)
        },
        function(callback_2){
          // Создаем папку commons
          base.folderGenerator(userFolder + '/' + config.folder.commons,callback_2)
        }
      ], (err,result) =>{
        // Вызвать колбек по завершение создания папок
        callback();
      })
    }
  ],(err)=>{
    if(err){
      sendMasage(err,res,0);
    }else{
      res.send({status: 'reg'});
    }
    
    
  })
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