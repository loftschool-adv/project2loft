'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
let Jimp       = require('jimp');
let async      = require('async');
let multiparty = require('multiparty');
let server     = require('../server.js');

let mongoose = require('../modules/libs/mongoose.js');
let Image = require('../modules/models/image.js').Image;

//var files = [];

function uploadImg(req, res) {

  var tmpFiles = [];

  var form = new multiparty.Form();
  form.uploadDir = 'users/id' + req.session.user_id + '/tmp/';
  form.autoFiles = true;

  form.on('file', function (name, file) {

    if (file.originalFilename) {

      if (!req.session.uploadFiles) {
        tmpFiles = [];
      } else {
        tmpFiles = req.session.uploadFiles;
      }



      tmpFiles.push(file);

      console.log('Картинка загруженна');

      let _thumb = file.path.split('.');
      let thumb = _thumb[0] + '-small.' +  _thumb[1];
      console.log(thumb);

      Jimp.read(file.path).then(function(image){

        console.log(file.path, '-> resize ->', thumb);

        image.resize(380, Jimp.AUTO);
        image.write(thumb);

        res.write(thumb);
        req.session.uploadFiles = tmpFiles;

        res.end();

        //server.io.emit('eventClient', {thumb: thumb});

      });

    }
});

// Close emitted after form parsed
  form.on('close', function() {
    console.log('Upload completed!');

    //imgSave(req, files);
  });

// Parse req
  form.parse(req);



}

function imgSave(req, res, files) {

  async.eachSeries(files, function (file, callbackEach) {

    //Перебираем файлы

    async.waterfall([

      // 1. Записываем в базу
      function (callback_1) {

        console.log(file.path);
        console.log('Запись в базу');

        // Запись в базу

        let image = new Image({
          album: req.session.album,
          user_id: req.session.user_id
        });

        // Сохраняем картинку в базу
        image.save(function (err, image, affected) {
          if (err) throw err;
          console.log('Сохранена картинка в базу');
          //console.log(image);
          //console.log(affected);

          callback_1(null, image.img_id);
        });

      },

      // 2. Сохраняем большую картинку
      function (id, callback_2) {

        //console.log(req.session);
        let type = file.path.split('.').pop();

        let newPath = 'users/id' + req.session.user_id + '/albums/'
          + req.session.album + '/img' + id + '.' + type;



        //Ресайз изображений
        Jimp.read(file.path).then(function(image){

          console.log(file.path, '-> resize ->', newPath);

          image.resize(1200, Jimp.AUTO);
          image.write(newPath);

          callback_2(null, type, id);

        });

      },

      // 3. Сохраняем маленькую картинку
      function (type, id, callback_3) {

        let newPathSmall = 'users/id' + req.session.user_id + '/albums/'
          + req.session.album + '/small-img' + id + '.' + type;

        //Ресайз изображений
        Jimp.read(file.path).then(function(image){

          console.log(file.path, '-> resize ->', newPathSmall);

          image.resize(380, Jimp.AUTO);
          image.write(newPathSmall);

          callback_3(null);

        });

          // Итерация закончена
      }], function (err) {

      callbackEach(null);

    });

  }, function (err, results) {

    // Сохранили все картинки
    res.end();

  });

}


function closeImgUploader(req, res) {

  console.log(req.session.uploadFiles);

  req.session.uploadFiles = [];

  console.log('clear');
  console.log(req.session.uploadFiles);

  res.end('close');
}

function closeOneImgUploader(req, res) {

  let tmpFiles = req.session.uploadFiles;

  tmpFiles.splice(tmpFiles.indexOf(req.body.id), 1);

  req.session.uploadFiles = tmpFiles;

  res.end('close');
}


exports.uploadImg = uploadImg;
exports.imgSave = imgSave;
exports.closeImgUploader = closeImgUploader;
exports.closeOneImgUploader = closeOneImgUploader;