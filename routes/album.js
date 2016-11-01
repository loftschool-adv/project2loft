'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');
// Подключаем файл с моделью юзеров
let mongoose = require('../modules/libs/mongoose.js');
let Album = require('../modules/models/album.js').Album;
let Image = require('../modules/models/image.js').Image;

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/*', (req,res) =>{
  var title = req.url.split('/').pop();
  req.session.album = title;

  console.log(req.session);



  res.render('album',  { title: title });
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