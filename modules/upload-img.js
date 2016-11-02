'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
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

      imgSrc = 'users/' + req.session.email + '/' + req.session.album + '/' + filename;

    fs.writeFile(imgSrc, field, 'binary', function(err){
      if (err) throw err;
      console.log('File saved.');
      console.log(req.session.email);
      //console.log(req.headers);
    });

    console.log('Upload completed!');
  })
  .on('end', function() {
        console.log('-> upload done');

        addImgDB(req, imgSrc);
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
    console.log('Сохранена картинка в базу')
  });
}

module.exports = uploadImg;