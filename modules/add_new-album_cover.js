let async = require('async');
let User = require('./models/user.js');
let multiparty = require('multiparty');
let BaseModule = require('./libs/_base.js');
let base = new BaseModule;
let config = require('../config.json');
let Jimp   = require('jimp');
let path = require('path');

let folder = config.folder.users;
let tmpFolder = config.folder.tmp;


// Добавлене альбомов
let addAlbumCover = function(req,res){

	let form = new multiparty.Form();
	let userPath = `./${folder}/id${req.session.user_id}/${tmpFolder}`;

	form.parse(req, function(error, fields, files){
		async.waterfall([
			function(callback){
				// Проверка на файл
				if(!Object.keys(files).length){
					callback("Ошибка")
				}else{
					callback();
				}
			},
			function(callback){
				// очищаем папку tmp данного пользователя, если ее нет то создаем
				base.clearFolder(userPath,callback);
			},
			function(callback){
				
				async.forEach(files,(file)=>{
					let newFilePath = '/'+ base.passGenerate(4) + '-newAlbomCover' + path.extname(file[0].path);
					Jimp.read(file[0].path).then(function(image){
          	image.resize(500, Jimp.AUTO);
	          image.write(userPath + newFilePath,()=>{
	          	callback(null,newFilePath);
	          });
	      	});
				})
			}

		],(err,newFile)=>{
			if(!err){
				res.json({
					newAlbomCover: userPath + newFile
				})
			}
		});
	})

}


module.exports = addAlbumCover;