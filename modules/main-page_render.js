let async = require('async');
let fs = require('fs');
let config = require('../config.json');
let User = require('./models/user.js').User;
let Album = require('./models/album.js').Album;
let Image = require('./models/image.js').Image;
let dateFormat = require('dateformat');
let BaseModule = require('./libs/_base.js');
let base = new BaseModule;
let translit = require('translit-be2ascii');
let slug = require('slug');

let folder = config.folder.users;
let albumsFolder = config.folder.albums;
let commons = config.folder.commons;


// Отображаем главную страницу пользователя
let mainPageRender = function(req,res,next){

	// Формируем супер массив для рендеринга
	let renderObj = {
		albums : {

		}
	}

 async.waterfall([
 	function(callback){
 		// Если сессия не совпадаем с id в ссылке, передаем управление в роутер user
 		if(req.baseUrl != '/id' + req.session.user_id){
			next();
		}else{
			callback();
		}
 	},
 	function(callback){
 		// Если все совпало начинаем искать пользователя в базе
 		User.findOne({email: req.session.email},callback)
 	},
 	function(user,callback){
 		// Записываем данные пользователя в глобальный объект, для доступа ко всем шаблонам
 		res.locals.userName = user.name;
	  res.locals.userAbout = user.about;
	  res.locals.email = req.session.email;
	  callback(null,user)
 	},
 	function(user,callback){
 		// Сканируем папку сommons
 		fs.readdir(`${folder}/id${req.session.user_id}/${commons}/`, callback)
 	},
 	function(files,callback){
 		// Пробегаемся по полученным файлам
 		async.each(files,(file,callback_2) => {
 			//Получаем имя файла
 			let fileName = file.split('.')[0];
 			if(fileName == 'background'){
 				// Если файл равен background, значит это фон шапки. Записываем его путь глобально
				res.locals.backgroundIamge = `/id${req.session.user_id}/${commons}/${file}`;
	    }
	    if(fileName == 'avatar'){
 				// Если файл равен background, значит это фон шапки. Записываем его путь глобально
				res.locals.avatar = `/id${req.session.user_id}/${commons}/${file}`;
	    }
	    callback_2();
 		},() =>{
 			// Когда закончим с файлами, пойдем дальше
 			callback();
 		})
 	},
 	function(callback){
 		// Ищем альбома данного пользователя в базе и получаем в отсортированном виде
 		async.waterfall([

 			function(callback_2){
 				Album.find({user_id: req.session.user_id},callback_2)
 			},
 			function(albums,callback_2){
 				Image.find({user_id: req.session.user_id},(err,image)=>{
 					callback_2(null,image,albums)
 				})
 			}

 		],(err,albums,image) => {
 			callback(null,image,albums);
 	})
 		
 	},
 	function(albums,image,callback){
 		if(!albums.length){
 			callback()
 		}else{
 			var array = [];
 			async.each(albums,(album,callback_2) => {
 			//console.log(dateFormat(album.created, "HH:MM dd.mm.yyyy"))
 			let newAlbumName = slug(translit.toASCII(album.name));
 			
 			renderObj.albums[album.name] = {
 				name: album.name,
 				date : dateFormat(album.created, "HH:MM dd.mm.yyyy"),
 				about: album.about,
 				cover: `/id${req.session.user_id}/${albumsFolder}/${newAlbumName}/${album.cover}`,
 				imageNumber: (function(){
 					var counter = 0
 					image.forEach(function(item){
 						if(item.album == newAlbumName){
 							counter++;
 						}
 					})
 					return counter;
 				})()
 			}
 			
	 		},() => {
	 			callback_2();
	 		})
	 		callback();
 		}
 	}




 	],(err)=>{
 		if(err) throw err;
 		// Если все окей отображаем, страницу пользователя
 		res.locals.mainPageData = renderObj;
 		res.render('main-page',  { title: 'Главная' })
 })
}


module.exports = function(req,res,next){
	mainPageRender(req,res,next);
}