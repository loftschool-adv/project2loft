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

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/', (req,res) =>{
  let title = req.url.split('/').pop();
  req.session.album = title;
  res.render('album',  {
    userName: req.session.name 
  });
});



route.get('/Tester', (req,res) =>{
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
  // Создаем экземпляр пользователя
  let album = new Album({
    name : req.name,
    about: req.about
  });
  // Сохраняем пользователя в базу
  album.save(function( err, album, affected){
    if (err) throw err;
    console.log('Создан альбом');
    res.end('end');
  });
});

module.exports = route;