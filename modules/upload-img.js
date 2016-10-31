'use strict';

let fs         = require('fs');
let path       = require('path');
let util       = require('util');
let formidable = require('formidable');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;

function uploadImg(req, res) {
  console.log("Пришел запрос с картинкой");

  var Header = new formidable.IncomingForm();
  var File = new formidable.IncomingForm();
  var filename;

  File.maxFieldsSize = 8 * 1024 * 1024;
  File.multiples = true;

  Header.parse(req);

  // Parts are emitted when parsing the form
  Header.onPart = function(part) {

    if (part) {
      var fileType = part.mime.split('/').pop();
      filename = base.passGenerate(12) + '.' + fileType;
      console.log(filename);
    }
  };


  File.parse(req, function(err, fields) {
    console.log(fields);

    fs.writeFile('tmp/' + filename, fields, 'binary', function(err){
      if (err) throw err;
      console.log('File saved.');
      //console.log(req.headers);
    });

    console.log('Upload completed!');
    res.end('upload');
  });

}

module.exports = uploadImg;