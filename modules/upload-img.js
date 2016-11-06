'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
let Jimp       = require('jimp');
let async      = require('async');
let multiparty = require('multiparty');
let server     = require('../server.js');

let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let mongoose = require('../modules/libs/mongoose.js');
let Image = require('../modules/models/image.js').Image;

function uploadImg(req, res) {

  var count = 0;
  var form = new multiparty.Form();
  form.uploadDir = 'users/id' + req.session.user_id + '/tmp/';
  form.autoFiles = true;
  var files = [];

  // form.on('progress', function (bytesReceived, bytesExpected) {
  //   console.log(bytesReceived / bytesExpected * 100, '%');
  // });

  form.on('file', function (name, file) {

    files.push(file);

    console.log('Картинка загруженна');

    let _thumb = file.path.split('.');
    let thumb = _thumb[0] + '-small.' +  _thumb[1];
    console.log(thumb);

    Jimp.read(file.path).then(function(image){

      console.log(file.path, '-> resize ->', thumb);

      image.resize(100, Jimp.AUTO);
      image.write(thumb);

      server.io.emit('eventClient', {thumb: thumb});

      //res.json({ thumb : thumb });

    });

    //imgProcessing(file);
  });

// Close emitted after form parsed
  form.on('close', function() {
    console.log('Upload completed!');

    res.end('ok');
    //imgSave(req, files);
  });

// Parse req
  form.parse(req);



}

function imgSave(req, files) {

  files.map(function (file) {

    console.log(file.path);
    console.log('Запись в базу');

    // Запись в базу

    let image = new Image({
      album: req.session.album,
      user_id: req.session.user_id
    });

    // Сохраняем картинку в базу
    image.save(function( err, image, affected){
      if (err) throw err;
      console.log('Сохранена картинка в базу');
      console.log(image);
      console.log(affected);

      // Обрабатываем изображение
      imgProcessing(req, file, image.img_id);

    });

  });
}

function imgProcessing(req, file, id) {

  console.log(req.session);
  let type = file.path.split('.').pop();

  let newPath = 'users/id' + req.session.user_id + '/albums/'
                           + req.session.album + '/img' + id + '.' + type;

  let newPathSmall = 'users/id' + req.session.user_id + '/albums/'
                                + req.session.album + '/small-img' + id + '.' + type;

  //Ресайз изображений
  Jimp.read(file.path).then(function(image){

      console.log(file.path, '-> resize ->', newPath);

      image.resize(1200, Jimp.AUTO);
      image.write(newPath);

  });

  //Ресайз изображений
  Jimp.read(file.path).then(function(image){

    console.log(file.path, '-> resize ->', newPathSmall);

    image.resize(380, Jimp.AUTO);
    image.write(newPathSmall);

  });


}



  // Image.find({}).sort({img_id:-1}).limit(1).then((item) => {
  //   if (item > 0) {
  //     counter = item + 1;
  //   } else {
  //     counter = 1;
  //   }
  //
  // });


  /////////////////

  // //var Header = new formidable.IncomingForm();
  // var File = new formidable.IncomingForm();
  // var files = [];
  // var tmp;
  // var counter = false;
  //
  // File.multiples = true;
  // File.uploadDir = "users/id2/tmp";
  //
  // File
  //   .on('fileBegin', function(name, file) {
  //
  //     console.log('начинаем загрузку файлов');
  //     //console.log('counter:', ++counter);
  //
  //   })
  //   .on('progress', function(bytesReceived, bytesExpected) {
  //
  //     //console.log(bytesReceived / bytesExpected);
  //
  //   })
  //   .on('file', function(name, file) {
  //
  //       files.push([file]);
  //   })
  //   .on('end', function() {
  //     console.log('end');
  //     //console.log(files);
  //     imgProcessing(req, files, counter);
  //
  //     res.end('upload');
  //   });
  //   res.end('upload');
  //   File.parse(req);
  //
  // }



function addImgDB(req) {
  // Создаем экземпляр пользователя
  console.log(req.session);

  let image = new Image({
    //src: imgSrc,
    album: req.session.album,
    user_id: req.session.user_id
  });

  // Сохраняем картинку в базу
  image.save(function( err, image, affected){
    if (err) throw err;
    console.log('Сохранена картинка в базу');
    console.log(image);
    console.log(affected);
  });
}

function imgProcessing2(req, files, counter) {
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