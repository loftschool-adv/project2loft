'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
let Jimp       = require('jimp');
let async      = require('async');
let multiparty = require('multiparty');

let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let mongoose = require('../modules/libs/mongoose.js');
let Image = require('../modules/models/image.js').Image;
var files = [];

var WebSocketServer = require('ws');

var clients = {};

// WebSocket-сервер на порту 4001
var webSocketServer = new WebSocketServer.Server({
  port: 4001
});
webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    for (var key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});

function uploadImg(req, res) {

  var count = 0;
  var form = new multiparty.Form();
  form.uploadDir = 'users/id' + req.session.user_id + '/tmp/';
  form.autoFiles = true;


  // form.on('progress', function (bytesReceived, bytesExpected) {
  //   console.log(bytesReceived / bytesExpected * 100, '%');
  // });

  form.on('file', function (name, file) {

    if (file.originalFilename) {

      files.push(file);

      console.log('Картинка загруженна');

      let _thumb = file.path.split('.');
      let thumb = _thumb[0] + '-small.' +  _thumb[1];
      console.log(thumb);

      Jimp.read(file.path).then(function(image){

        console.log(file.path, '-> resize ->', thumb);

        image.resize(100, Jimp.AUTO);
        image.write(thumb);

        // var src = thumb;
        // src =String(src).replace(/\\/g, "/");
        // src = src.substr(6);

        //webSocketServer.send('something');
        //   ws.send('something');
        // });

        webSocketServer.on('open', function open() {
          webSocketServer.send('something');
        });


        //server.io.emit('eventClient', {thumb: src});

      });

    }
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

  });

}

exports.upload = uploadImg;
exports.save = imgSave;
exports.files = files;