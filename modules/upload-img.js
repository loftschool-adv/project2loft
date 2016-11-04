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
  var imgType;
  var imgSrc;
  var tmp;
  var counter = 0;

  File.maxFieldsSize = 8 * 1024 * 1024;
  File.multiples = true;

  Header.parse(req);

  // Parts are emitted when parsing the form
  Header.onPart = function(part) {

    if (part) {
      var fileType = part.mime.split('/').pop();
      filename = 'IMG' + base.passGenerate(10) + '.' + fileType;
      imgType = fileType;
      console.log(filename);
    }
  };


  File
    .on('field', function(name, field) {

      tmp = 'tmp/' + filename;

      console.log(req.session.album);

      console.log(++counter);


      //console.log(imgSrc);

      //console.log(req);

    fs.writeFile(tmp, field, 'binary', function(err){

      console.log('File saved.');
      console.log(req.session.user_id);
      //console.log(req.headers);
    });

    console.log('Upload completed!');
  })
  .on('end', function() {

    async.waterfall([
      function (callback) {
        Image.find({}).sort({img_id:-1}).limit(1).then((item) => {
          console.log(item[0].img_id);
          imgSrc = 'users/id' + req.session.user_id + '/albums/' + req.session.album + '/img' + item[0].img_id + '.' + imgType;
          callback(null, imgSrc);
        });
      },
      function (imgSrc, callback) {
        console.log(tmp);
        console.log(imgSrc);

        //Ресайз изображений
        Jimp.read(tmp).then(function(image){

          image.resize(500, Jimp.AUTO);
          image.write(imgSrc);

          console.log('resize');
          callback(null, 'finish');
        });
      }],
      function (err, result) {
        addImgDB(req, imgSrc);
        console.log(result);
    });

    res.end('upload');
  });

  File.parse(req);

}

function addImgDB(req, imgSrc) {
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

module.exports = uploadImg;