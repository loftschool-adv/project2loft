let fs = require('fs');
let async = require('async');
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let config = require('../../config.json');
let translit = require('translit-be2ascii');
let slug = require('slug');
let path = require('path');
let Jimp = require('jimp');
let del = require('del');



let folder = config.folder.users;
let albumsFolder = config.folder.albums;
let tmpFolder = config.folder.tmp;




let addAlbum = function(req,res){

	findObj = {};
	resObj = {
		album : {}
	}
	let albumsPath = `./${folder}/id${req.session.user_id}/${albumsFolder}/`;
	let tmpPath = `./${folder}/id${req.session.user_id}/${tmpFolder}/`;

	
	async.waterfall(
		[
			function(callback){
				// Поиск по базе

				Album.find({user_id : req.session.user_id},(err,albums)=>{
					if (err) throw err;
					
				}).then((albums)=>{
					findObj.albums = albums;
					callback();
				})

			},
			function(callback){
				// Определяем существование таково же альбома
				async.each(findObj.albums,(album,callback_2)=>{
					if(album.name == req.body.name){
						callback_2('Такой альбом уже существует');
						return false;
					}else{
						callback_2();
					}
				},(err)=>{
					if(err){
						callback(err);
					}else{
						callback();
					}
					
				})

			},
			function(callback){
				// Создаем папку albums, если ее нет
				base.folderGenerator(`./${folder}/id${req.session.user_id}/${albumsFolder}`,callback)
			},
			function(callback){
				// Создаем папку с альбомом
				let newAlbumName = slug(translit.toASCII(req.body.name)).toLowerCase();
				let newAlbumFolder =  albumsPath + newAlbumName + '/';
				resObj.album.name = newAlbumName;
				resObj.album.totalPath = newAlbumFolder;
				resObj.album.path = newAlbumFolder.replace(`./${folder}`,'');
				base.folderGenerator(newAlbumFolder,callback)
			},
			function(callback){
				// Переносим файл из tmp
				async.series([

					function(callback_2){
						fs.readdir(tmpPath,(err,items)=>{
				  		if(err) throw err;
				  		async.each(items,(item,callback_3)=>{
				  			if((item.indexOf('newAlbomCover-') + 1)){
					  			Jimp.read(tmpPath + item).then((image)=>{
					  				image.write(resObj.album.totalPath + item,()=>{
					  					resObj.album.cover = item;
					  					callback_2();
					  				});
						  			
					  			})
				  			}




				  		},(err)=>{
				  			if(err) throw err;
				  			
				  		})
				  	})
					},
					function(callback_2){
						// Очищаем папку tmp
						callback_2();
						//base.clearFolder(tmpPath,callback_2)
					}

				],()=>{
					callback();
				})
			},
			function(callback){
				// Сохраняем альбомом и обложку
				async.parallel(
					[
						function(callback_2){
							let album = new Album({
								name : resObj.album.name,
								about: req.body.about,
								user_id: req.session.user_id,
								originName: req.body.name,
								cover: resObj.album.path + resObj.album.cover
							})
							album.save(callback_2);
						},
						function(callback_2){
							let image = new Image({
				        name: "Обложка альбома",
				        album: resObj.album.name,
				        user_id: req.session.user_id,
				        src: resObj.album.path + resObj.album.cover
				      });

				      image.save(callback_2);
						}

					],(err) =>{
						if(err)throw err;
						callback();
				})
			},
		],
	(err)=>{
		if(err){
			res.json({error: err})
		}else{
			// Генерируем альбом
			ajaxAlbum = `<div class="album-cards__item">
						<div class="album-card">
							<a class="album-card__head" href=/id${req.session.user_id}/${albumsFolder}/${resObj.album.name} style="background-image: url(${resObj.album.path + resObj.album.cover})">
								<div class="album-card__info">
									<div class="album-card__title">${req.body.about}</div>
									<div class="album-card__cnt">Количетво фотографий 1</div>
								</div>
							</a>
							<div class="album-card__foot">
								<div class="album-card__foot-part">
									<a class="btn btn--icon" href="#404" title="Редактировать">
										<svg class="btn__icon">
											<use xlink:href="/img/sprite.svg#edit"></use>
										</svg>
									</a>
								</div>
								<div class="album-card__foot-part">
									<a class="album-card__link" href=/id${req.session.user_id}/${albumsFolder}/${resObj.album.name}>${req.body.name}</a>
								</div>
							</div>
						</div>
					</div>`;








			res.json({
					newAlbum: ajaxAlbum
					
				})
		}

	})
}


module.exports = addAlbum;