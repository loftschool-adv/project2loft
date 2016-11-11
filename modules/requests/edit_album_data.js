let fs = require('fs');
let path = require('path');
let async = require('async');
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let del = require('del');
let translit = require('translit-be2ascii');
let slug = require('slug');
let mv = require('mv');

let config = require('../../config.json');
let Jimp   = require('jimp');
let folder = config.folder.users;
let commons = config.folder.commons;
let albumsFolder = config.folder.albums;
let tmpFolder = config.folder.tmp;

let mongoose = require('mongoose');

let Counter = mongoose.models.IdentityCounter;


// Редактирование данных пользователя
let editUserData = function(req,res){
	let urlNameAlbum = req.url.split('/')[1];
	let findObj = {};
	let resObj = {
		album: {

		},
		images: [

		]
	};
	// Обрабатываем данные через 
	async.waterfall([

			function(callback){
			// Начинаем массовый поиск по базе
			async.waterfall([

				function(callback_2){
					Album.find({user_id : req.session.user_id, name: urlNameAlbum}, (err,album) =>{

					}).then((album) => {
						findObj.album = album[0];
						callback_2();
					})
				},

				function(callback_2){
					Image.find({user_id : req.session.user_id, album: findObj.album.name}, (err,images) =>{

					}).then((images) => {
						findObj.images = images;
						callback_2();
					})
				},
				function(callback_2){
					Image.findOne({user_id : req.session.user_id, album: findObj.album.name,cover: 1}, (err,images) =>{

					}).then((images) => {
						findObj.cover = images;
						callback_2();
					})
				},
				function(callback_2){
					Counter.find({model : 'Image'},(err,counter)=>{
					if (err) throw err;
					
					}).then((counter)=>{
						findObj.imageCounter = counter[0].count;
						
						callback();
					})
				}

				],(err) => {
				if(err) throw err;
				callback();
			})
		},
		function(callback){
			// Обрабатываем имя альбома
			resObj.album.name = slug(translit.toASCII(req.body.albumName)).toLowerCase();
			//resObj.album.newCoverPath = findObj.album.cover.replace(`${findObj.album.name}`,`${resObj.album.name}`);
			callback();
		},
		function(callback){

			// Переименовываем папку альбома

			resObj.album.oldPath  = `./${folder}/id${req.session.user_id}/${albumsFolder}/${findObj.album.name}/`;
			resObj.album.newPath = `./${folder}/id${req.session.user_id}/${albumsFolder}/${resObj.album.name}/`;
			mv(resObj.album.oldPath, resObj.album.newPath,(err)=>{

				if(err) throw err;
				callback();

			})

			
		},
		function(callback){
	    	// Перебираем объект файл если он не пустой
	    	let tmpPath = `${folder}/id${req.session.user_id}/${tmpFolder}/`;

	    	
	    	async.waterfall([

	    		function(callback_2){
		    		fs.readdir(tmpPath,(err,items)=>{
		    			
				  		if(err) throw err;

				  		if(items.length){
				  			async.each(items,(item,callback_3) =>{

									if((item.indexOf('newAlbomCover-') + 1)){

											let fileFormat = item.split(".").pop();
											let newFileCoverPath = "albumCover-" + base.passGenerate(4)
											+ '-img' + findObj.imageCounter + '.' + fileFormat;


							  				Jimp.read(tmpPath + '/' + item).then((image)=>{
							  					image.write(resObj.album.newPath + newFileCoverPath);
							  					resObj.newFile = newFileCoverPath;
								  				callback_3();
							  				})
						  			}else{
						  				callback_3();
						  			}
					  			

					  		},(err) =>{

					  			callback_2();

					  		})
				  		}else{

				  			callback_2();
				  		}
				  	})



	    		},
	    		function(callback_2){

	    			//console.log(findObj.cover.rc)

	    			fs.readdir(resObj.album.newPath,(err,items)=>{
				  		if(err) throw err;
				  		async.each(items,(item,callback_3)=>{

				  			if(item.indexOf('albumCover-') + 1){


				  				del([resObj.album.newPath + item,'!' + resObj.album.newPath + resObj.newFile]).then((file)=>{
				  					if(file[0]){
				  						resObj.album.oldCover = file[0].split('\\')[file[0].split('\\').length - 1];
				  						
				  					}
				  					
				  					callback_3();
				  				})
				  			}
				  			

				  		})
				  		callback_2();
				  	})
	    		}

	    	],(err) => {
	    		callback();
	    	})
	  },
		function(callback){
			// Обновляем данные в базе
			
			resObj.album.newFileCover = resObj.album.newPath.replace('./users','') + resObj.newFile;
			async.waterfall([

				function(callback_2){
					Album.update({user_id : req.session.user_id, name: findObj.album.name}, {

					$set: {
						name: resObj.album.name,
						originName: req.body.albumName,
						about: req.body.albumAbout,
						cover: resObj.album.newFileCover
					}


					}).then(() => {
						callback_2();
					})
				},			
				function(callback_2){
					// Меняем обложку альбома
					//console.log(resObj.album.newPath.replace('./users','') + resObj.album.oldCover)
					Image.findOneAndUpdate(
						{user_id : req.session.user_id, album: findObj.album.name,cover: 1},
							{$set:{

								src: resObj.album.newPath.replace('./users','') + resObj.newFile

								}
							}
					).then(() => {
						callback_2();
					})

				},
				function(callback_2){
					// Переименовываем путь и имя альбома в каждой фотографии
					async.each(findObj.images,(image,callback_3) =>{
						resObj.images.push({
							img_id: image.img_id,
							src: resObj.album.newPath + image.img_id
						})

						Image.update({user_id : req.session.user_id, album: findObj.album.name,img_id: image.img_id,cover: 0}, {

							$set: {
								album: resObj.album.name,
								src: image.src.replace(`${findObj.album.name}`,`${resObj.album.name}`)
							}


						}).then(() => {
							callback_3();
						})




					},(err)=>{
						if(err) throw err;
						callback_2();
					})
				},
	


				],(err)=>{

				if(err) throw err;
				callback();

			})
			
		},
		function(callback){
			// Формируем объект отправки

			resObj.album.about = req.body.albumAbout;
			resObj.album.originName = req.body.albumName;

			callback();
		},
		function(callback){
			// Чистим папку папку tmp

			base.clearFolder(`./${folder}/id${req.session.user_id}/${tmpFolder}`,callback);
		},

    ],(err,test)=>{
    	//console.log(resObj);
    	if(err){
    		throw err;
    	}else{
    		res.json(resObj);
    	}
  	})
}


module.exports = function(req, res){
	editUserData(req, res);
}