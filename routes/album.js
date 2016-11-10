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
let upload = require('../modules/upload-img.js');


route.get('/:album', (req,res) =>{
  //console.log(req.session.album);

  //console.log(req.url);

  if (req.url != '/undefined') {

    async.waterfall([
        function(callback){
          let title = req.url.split('/').pop();
          req.session.album = title;

          //console.log('Имя альбома: ');
          //console.log(title);
          callback(null, title);
        },
        // Ищем все изображения в альбоме тестер
        function(title, callback){
          Image.find({'album' : title}, callback);
        },
        // Получаем путь из каждого изображения
        function(image, callback){

          //console.log(image);

          var arr = [];
          if(image[0]){

            //console.log('Картинки нашли');
            //console.log(req.session);
            //console.log(image[0]);

            //console.log('Ищу');
            image.forEach(function(img){
              //console.log('Итерация');
              //console.log(img);
              arr.push(img.src); //.replace('users/')
            });
            callback(null, arr);
          } else {
            callback(null, null);
          }

        },
        //
        function(src, callback){
          //console.log('генерирую');
          //console.log(src);
          //console.log(arr);
          if (src !== null) {

            res.render('album',  {
              userName: req.session.name,
              photos: src
            }, callback(null, 'done'));

          } else {

            res.render('album',  {
              userName: req.session.name,
            }, callback(null, 'done'));

          }
        }],

      //render
      function(err, result){
        //console.log(result);
      })
  }



});

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug

route.post('/:album/addImg/', (req, res) => upload.uploadImg(req, res));
route.post('/:album/saveImg/', (req, res) => upload.imgSave(req, res, req.session.uploadFiles));
route.post('/:album/closeUploaderImg/', (req, res) => upload.closeImgUploader(req, res));
route.post('/:album/closeUploaderOneImg/', (req, res) => upload.closeOneImgUploader(req, res));


module.exports = route;