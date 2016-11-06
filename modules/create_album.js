let async = require('async');
let User = require('./models/user.js');
let Album = require('./models/album.js').Album;
let Image = require('./models/album.js').Image;
let multiparty = require('multiparty');
let BaseModule = require('./libs/_base.js');
let base = new BaseModule;
let config = require('../config.json');


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
				// Проверяем есть ли папка albums, если нет то создаем
				//base.checkDirectory(albumsPath,callback);
				let newAlbumFolder =  albumsPath + '/' + fields.albumName[0] + '\\'; 
				base.checkDirectory(newAlbumFolder,callback);
			},
			function(callback){
				// Проверяем есть ли папка albums, если нет то создаем
				
				//base.checkDirectory(newAlbumFolder,callback);
			},
		/*	function(callback){
				// Зписываем фотографию в папку пользователя
					async.forEach(files,(file)=>{
					let newFilePath = 'img' + path.extname(file[0].path);
					Jimp.read(file[0].path).then(function(image){
          	image.resize(500, Jimp.AUTO);
	          image.write(userPath + newFilePath,()=>{
	          	callback(null,newFilePath);
	          });
	      	});
				})

			}*/





		],(err)=>{
			if(err){
				throw err;
				//res.send(err)
			}else{
				res.json({})
			}

		})
	});


	





	/*let album = new Album({
		name : req.body.name,
		about: req.body.about,
		user_id: req.session.user_id
	});*/
	// Сохраняем пользователя в базу
	/*album.save(function( err, album, affected){
		if (err) throw err;
		console.log('Создан альбом');
		res.end('end');
	});*/
}


module.exports = addAlbum;