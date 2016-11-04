'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');
// Подключаем файл с моделью юзеров
let mongoose = require('../modules/libs/mongoose.js');
let Album = require('../modules/models/album.js').Album;
let User = require('../modules/models/user.js').User;
let Image = require('../modules/models/image.js').Image;
let async = require('async');
let path = require('path');


route.get('/:album', (req,res) =>{
  let title = req.url.split('/').pop();
  console.log(12);
  req.session.album = title;
  res.render('album',  {
    userName: req.session.name 
  });
});

/*route.param('album', function (req, res, next, album) {
  console.log('Tester');
  album = 'Tester';
  next();
});*/




route.get('/:album', (req,res) =>{
  console.log(req.session.album)
  async.waterfall([
    // Ищем все изображения в альбоме тестер
    function(callback){
      Image.find({'album' : 'Tester'},callback);
    },
    // Получаем путь из каждого изображения
    function(image,callback){
      var arr = [];
      if(image){
        image.forEach(function(img){
          arr.push(img.src.replace('users/',''));
          callback(null,arr);
        });
      }
    },
    // 
    function(src,callback){
      let title = req.url.split('/').pop();
      req.session.album = title;
      res.render('album',  {
        userName: req.session.name,
        photos: src
      });
      callback
    }

    //render
  ],function(err,arg){

  })
 
});

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.post('/add/', (req,res) =>{
  //console.log(req);
  // Создаем экземпляр пользователя
  let album = new Album({
    name : req.body.name,
    about: req.body.about,
    user_id: req.session.user_id
  });
  // Сохраняем пользователя в базу
  album.save(function( err, album, affected){
    if (err) throw err;
    console.log('Создан альбом');
    res.end('end');
  });
});

module.exports = route;