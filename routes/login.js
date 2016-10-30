// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';

let fs = require('fs');
let express = require('express');
let route = require('express').Router();
let mongoose = require('mongoose');
let sendMail = require('../modules/send-mail.js');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let folder = './users'  // Папка с пользователями


let sendMasage = function (message, res, status = 0) {
  res.json(
    {
      message: message,
      status: status
    })
};


route.get('', (req, res) => {
  if (!req.session.email) {
    res.render('index');
  } else {
    res.render('user');
  }
});


// Регистрация новых пользоватей
route.post('/reg/', (req, res) => {
  let User = require('../modules/models/user.js').User;
  for (let key in req.body) {
    if (!req.body[key]) {
      return sendMasage('Заполнены не все поля', res, 1);
    }
  }
  User.findOne({'email': req.body.email}).then((item) => {
    if (item) {
      return sendMasage('Такой email уже зарегитрирован', res, 2);
    } else {
      let user = new User({
        login: req.body.login,
        password: req.body.pass,
        email: req.body.email
      });
      user.save(function (err, user, affected) {
        if (err) throw err;
        // Создание папки пользователя
        base.checkDirectory(folder + "/" + user.email, function(err){
          if(err){
            fs.mkdir(folder + '/' + user.email, () => {});
          }
        });
        return sendMasage('Вы успешно зарегистрированы', res);
      });
    }
  })
});


// Вход на сайт 
route.post('/login/', (req, res) => {
  let User = require('../modules/models/user.js').User;


  User.findOne({'email': req.body.email}).then((item) => {
    console.log(req.body);
    if (item) {
      console.log(item.checkPassword(req.body.pass));
      if (item.checkPassword(req.body.pass)) {

        req.session._id = item._id;
        req.session.email = item.email;
        req.session.name = item.name;
        req.session.about = item.about;

        res.send({status: 'login'});
      }
      else {
        return sendMasage('Не верный пароль', res);
      }

    } else {
      console.log("Такой пользователь НЕ найден");
      res.send({});
    }
  });

});

// Выход с сайта 
route.post('/logout/', (req, res) => {
  if (req.body.req == 'logout') {
    req.session.destroy();
    res.send({status: 'logout'});
  }

});

// Васстоновление пароля
route.post('/recover/', (req, res) => {
  let User = require('../modules/models/user.js').User;
  let pass =  "" + Math.floor(Math.random() * (999999 - 1)) + 1;
  User.findOne({'email': req.body.email}).then((user) => {
    user.update({
      hashedpassword : user.encryptPassword(pass)
    },(err) => {if (err) throw err ;})
    sendMail(req.body.email, 'Восстановление пароля', 'Новый пароль: ' + pass)
    res.send({});
  })
});

module.exports = route;