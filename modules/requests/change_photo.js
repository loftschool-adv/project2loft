let fs = require('fs');
let async = require('async');
let User = require('../models/user.js');
let multiparty = require('multiparty');
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let config = require('../../config.json');
let Jimp   = require('jimp');
let path = require('path');
let del = require('del');

let folder = config.folder.users;
let tmpFolder = config.folder.tmp;


// Добавлене альбомов
let changeAvatar = function(req,res){

	let form = new multiparty.Form();
	let userPath = `./${folder}/id${req.session.user_id}/${tmpFolder}`;
	newFile = '';

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
				base.folderGenerator(userPath,callback);
			},
			function(callback){

				async.forEach(files,(file)=>{
					if(file[0].fieldName == "userBackGround"){
						var fileType = "background-";
					}else if(file[0].fieldName == "userAvatar"){
						var fileType = "avatar-";
					}else if(file[0].fieldName == "newAlbomCover"){
						var fileType = "newAlbomCover-";
					}
					let newFilePath = '/' + fileType + base.passGenerate(4)  + path.extname(file[0].path);
					Jimp.read(file[0].path).then(function(image){
          	image.resize(1000, Jimp.AUTO);
	          image.write(userPath + newFilePath,()=>{
	          	callback(null,newFilePath);
	          });
	      	});
				})
			},
			function(newFileName,callback){
				// очищаем папку tmp данного пользователя, если ее нет то создаем
				// Сохраняем новый файл глобально в этом модуле
				newFile = newFileName;
	    	async.parallel([

	    		// Очищаем папку tmp
	    		function(callback_2){
		    		fs.readdir(userPath,(err,items)=>{
				  		if(err) throw err;
				  		async.each(items,(item) =>{

				  			if((newFileName.indexOf('avatar-') + 1) && (item.indexOf('avatar-') + 1)){
					  				del([userPath + '/' + item, '!' + userPath + newFileName]).then(() => {
					  					
				  				})
				  			}else if((newFileName.indexOf('background-') + 1) && (item.indexOf('background-') + 1)){
					  				del([userPath + '/' + item, '!' + userPath + newFileName]).then(() => {
					  					
				  				})
				  			}else if((newFileName.indexOf('newAlbomCover-') + 1) && (item.indexOf('newAlbomCover-') + 1)){
					  				del([userPath + '/' + item, '!' + userPath + newFileName]).then(() => {
					  					
				  				})
				  			}
				  			

				  		})
				  		callback_2();
				  	})



	    		}

	    	],(err) => {
	    		callback();
	    	})
			}

		],(err)=>{
			if(!err){
				res.json({
					newCover: userPath.replace(`./${folder}`,'') + newFile
				})
			}
		});
	})

}


module.exports = changeAvatar;