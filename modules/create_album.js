let async = require('async');
let User = require('./models/user.js');
let Album = require('./models/album.js').Album;
let Image = require('./models/image.js').Image;
let multiparty = require('multiparty');
let BaseModule = require('./libs/_base.js');
let base = new BaseModule;
let config = require('../config.json');
let translit = require('translit-be2ascii');
let slug = require('slug');
let path = require('path');
let Jimp = require('jimp');



let folder = config.folder.users;
let albumsFolder = config.folder.albums;

// Добавлене альбомов
let addAlbum = function(req,res){

	let form = new multiparty.Form();
	let albumsPath = `./${folder}/id${req.session.user_id}/${albumsFolder}`;

	form.parse(req, function(error, fields, files){
		async.waterfall([
			function(callback){
				// Ищем альбом в базе по id
	      Album.find({'user_id': req.session.user_id},callback)
			},
			function(albums,callback){
				// Сверяем альбом с веденными данными
				async.each(albums,(album,callback_2)=>{
					if(album.name == fields.albumName[0]){
						callback_2('Такой альбом уже существует');
					}else{
						callback_2();
					}

				},(err) => {
					if(err){
						callback(err);
					}else{
						callback();

					}
				})
				
			},
			function(callback){
				// Сохраняем альбом
				let album = new Album({
					name : fields.albumName[0],
					about: fields.albumText[0],
					user_id: req.session.user_id
				})
				album.save(callback)
			},
			function(album,affected,callback){
				// Проверяем есть ли папка users, если нет то создаем
				base.folderGenerator('./' + folder,callback);
				
			},
			function(callback){
				// Проверяем есть ли папка albums, если нет то создаем
				base.folderGenerator(albumsPath,callback);
				
			},
			function(callback){
				// Проверяем есть ли папка albums, если нет то создаем
				let newAlbumName = slug(translit.toASCII(fields.albumName[0]));
				let newAlbumFolder =  albumsPath + '/' + newAlbumName + '\\';
				async.parallel(
					[
						function(callback_2){
							base.folderGenerator(newAlbumFolder,callback_2);
						}
					],(err)=>{
						if(err) throw err;
						callback(null,newAlbumFolder,newAlbumName)
				})
				
			},
			function(imageName,newAlbumName,callback){
				let image = new Image({
	        name: "Обложка альбома",
	        album: newAlbumName,
	        user_id: req.session.user_id
	      });
				async.parallel(
					[
						function(callback_2){
							// Сохраняем фоографию в базу
							image.save(callback_2)
						}

					]
					,(err,newImage)=>{
						if(err) throw err;
						callback(null,newImage,newAlbumName);
				})
			
	      
	      

			},
			function(newImage,newAlbumName,callback){
				// Записываем новое изображение в базу

				async.forEach(files,(file)=>{

					let newImageName = 'img'+ newImage[0][0].img_id;
					let newFilePath = newImageName + path.extname(file[0].path);
					let newAlbumCoverPath = albumsPath + '/' + newAlbumName + '/' + newFilePath;

					Jimp.read(file[0].path).then(function(image){
          	image.resize(500, Jimp.AUTO);
	          image.write(newAlbumCoverPath,()=>{
	          	callback(null,newImageName,newAlbumName);
	          });
	      	});
				})
			},
			function(image,album,callback){
				// Обновляем обложку облома в базе
				Album.findOneAndUpdate(
		    	{user_id: req.session.user_id,name : album},
		    	{$set : 
						{
							cover: image,
						}
					},callback
				)

			}
			






		],(err)=>{
			if(err){
				res.json({message: err})
			}else{
				res.json({message: 'Сохранено'})
			}

		})
	});

}


module.exports = addAlbum;