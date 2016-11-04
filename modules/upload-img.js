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

  var Header = new formidable.IncomingForm();
  var File = new formidable.IncomingForm();
  var filename;
  var imgSrc;
  var tmp;

  File.maxFieldsSize = 8 * 1024 * 1024;
  File.multiples = true;

  Header.parse(req);

  // Parts are emitted when parsing the form
  Header.onPart = function(part) {

    if (part) {
      var fileType = part.mime.split('/').pop();
      filename = 'IMG' + base.passGenerate(10) + '.' + fileType;
      console.log(filename);
    }
  };


  File
    .on('field', function(name, field) {

      //imgSrc = 'users/id' + req.session.user_id + '/albums/test/' + filename; //req.session.album
      tmp = 'tmp/' + filename;
      console.log(imgSrc);

    fs.writeFile(tmp, field, 'binary', function(err){

      console.log('File saved.');
      console.log(req.session.user_id);
      //console.log(req.headers);
    });

      //db.getCollection('images').find({}).sort({img_id:-1}).limit(1)

    console.log('Upload completed!');
  })
  .on('end', function() {

    //Ресайз изображений
    Jimp.read(imgSrc).then(function(image){

      image.resize(500, Jimp.AUTO)
      image.write(imgSrc);

      console.log('resize');
    });

    console.log('-> upload done');

    async.series([
      function(callback) {
        // Получаем информацию о файле
        console.log('1');
        callback();
      },
      function(callback) {
        // Получаем информацию о файле
        console.log('2');
        callback();
      },
      function() {
        // Получаем информацию о файле
        console.log('32');
      },
    ], function (err, result) {
      // result now equals 'done'
    });

    addImgDB(req, imgSrc);

    //Сохранени в БД

    res.end('upload');
  });

  File.parse(req);

}

function addImgDB(req, imgSrc, callback) {

  // Создаем экземпляр пользователя
  let image = new Image({
    src: imgSrc,
    album: req.session.album,
    user_id: req.session._id
  });
  // Сохраняем картинку в базу
  image.save(function( err, image, affected){
    if (err) throw err;
    console.log('Сохранена картинка в базу');
  });
}

function resize(callback) {
  console.log("async");
}

module.exports = uploadImg;