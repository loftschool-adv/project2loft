'use strict';

let fs         = require('fs');
let path       = require('path');
let formidable = require('formidable');
let util       = require('util');
var counter = 0;

function uploadImg(req, res) {
  console.log("Пришел запрос с картинкой");
  //console.log(req.methods);
  //console.log(req.headers);
  //console.log(req.url);

  var form = new formidable.IncomingForm();
  //var file = new formidable.File();
  var files = [];
  var fields = [];


  form.maxFieldsSize = 8 * 1024 * 1024;
  form.multiples = true;
  //form.uploadDir = '/upload';
  form.parse(req);
  form
    .onPart = function(part) {
      // You *must* act on the part by reading it
      // NOTE: if you want to ignore it, just call "part.resume()"

      if (!part.filename) {
        // filename is not defined when this is a field and not a file
        console.log(part.headers);
        console.log(part.mime);
        //var fileType = file.type.split('/').pop();

        // ignore field's content
        //part.resume();
        res.end('File upload');
      }

      if (part.filename) {
        // filename is defined when this is a file
        //count++;
        console.log('got file named ' + part.name);
        // ignore file's content here
        //part.resume();
      }

      part.on('error', function (err) {
        // decide what to do
      })
    };
  //   .on('field', function(name, field) {
  //     console.log(name, field);
  //
  //     counter++;
  //     fs.writeFile('./upload-test/img-' + counter + '.jpg', field, 'binary', function(err){
  //       if (err) throw err;
  //       console.log('File saved.');
  //       console.log(req.headers);
  //     });
  //
  //     fields.push([name, field]);
  //   })
  //   .on('file', function(field, file) {
  //     console.log('FILE!!!');
  //     console.log(field, file);
  //     files.push([field, file]);
  //   })
  //   .on('end', function() {
  //     console.log('-> upload done');
  //     res.writeHead(200, {'content-type': 'text/plain'});
  //     //res.write('received fields:\n\n '+util.inspect(fields));
  //     res.write('\n\n');
  //     res.end('received files:\n\n '+util.inspect(files));
  //   });
  // form.parse(req);
}

module.exports = uploadImg;