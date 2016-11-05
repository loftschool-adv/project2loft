'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
let Jimp       = require('jimp');
var async      = require('async');
let formidable = require('formidable');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let mongoose = require('../modules/libs/mongoose.js');
let Image = require('../modules/models/image.js').Image;

function uploadImg(req, res) {
  console.log("Пришел запрос с картинкой");

  Image.find({}).sort({img_id:-1}).limit(1).then((item) => {
    if (item > 0) {
      counter = item + 1;
    } else {
      counter = 1;
    }

  });

  //var Header = new formidable.IncomingForm();
  var File = new formidable.IncomingForm();
  var files = [];
  var tmp;
  var counter = false;

  File.multiples = true;
  File.uploadDir = "users/id2/tmp";

  File
    .on('fileBegin', function(name, file) {

      console.log('начинаем загрузку файлов');
      //console.log('counter:', ++counter);

    })
    .on('progress', function(bytesReceived, bytesExpected) {

      //console.log(bytesReceived / bytesExpected);

    })
    .on('file', function(name, file) {

        files.push([file]);
    })
    .on('end', function() {
      console.log('end');
      //console.log(files);
      imgProcessing(req, files, counter);

      res.end('upload');
    });
    res.end('upload');
    File.parse(req);

  }



function addImgDB(req, imgSrc) {
  // Создаем экземпляр пользователя
  console.log(req.session);

  let image = new Image({
    src: imgSrc,
    album: req.session.album,
    user_id: req.session.user_id
  });

  // Сохраняем картинку в базу
  image.save(function( err, image, affected){
    if (err) throw err;
    console.log('Сохранена картинка в базу');
  });
}

function imgProcessing(req, files, counter) {
  var imgSrc;
  var newCounter = counter;

  async.each(files, function (file, callbackEach) {

    newCounter++;

    console.log('Обрабатываем файл: ' + file);
    let imgType = file[0].type.split('/').pop();
    async.waterfall([
        // Function 1 - Поиск в базе изображений и создание нового адреса изображения
        function (callback) {

          imgSrc = 'users/id' + req.session.user_id + '/albums/' + req.session.album + '/img' + newCounter + '.' + imgType;
          callback(null, imgSrc, file);

        },

        // Function 2 - Ресайз и перезапись из tmp в папку пользователя
        function (imgSrc, file, callback) {
          //console.log(tmp);
          //console.log(imgSrc);
          //console.log(file[0].path);

          //Ресайз изображений
          Jimp.read(file[0].path).then(function(image){

            image.resize(500, Jimp.AUTO);
            image.write(imgSrc);

            console.log('resize');

            //console.log(file._writeStream.closed);
            callback(null, 'Изображение обработанно');
          });
        }],

      // END - Запись в базу данных
      function (err, result) {
        addImgDB(req, imgSrc);
        console.log(result);
        callbackEach('Изображение обработанно');
      });

  });
}

module.exports = uploadImg;