let async = require('async');
let fs = require('fs');
let config = require('../../config.json');
let User = require('../models/user.js').User;
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let dateFormat = require('dateformat');
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let translit = require('translit-be2ascii');
let slug = require('slug');
let sortBy = require('sort-by');

let folder = config.folder.users;
let albumsFolder = config.folder.albums;
let commons = config.folder.commons;


// Отображаем главную страницу пользователя
let mainPageRender = function(req,res,next){

	// Массив для всего поиска

	let findObj = {};

	// Формируем супер массив для рендеринга
	let renderObj = {albums : []}

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
 		// Если все совпало начинаем искать в базе
 		async.waterfall(
 			[
 				function(callback_2){
 					User.findOne({email: req.session.email},(err,user)=>{
 						callback_2(null,user)
 					});
 				},
 				function(user,callback_2){
 					Album.find({user_id : req.session.user_id},(err,albums)=>{
 						callback_2(null,user,albums)
 					});
 				},
 				function(user,albums,callback_2){
 					Image.find({user_id : req.session.user_id},(err,images)=>{
 						callback_2(null,user,albums,images)
 					});
 				}

 			],
 		(err,user,albums,images)=>{
 			callback(null,user,albums,images);
 		})
 	},
 	function(user,albums,images,callback){
 		//Записываем данные из базы в объект
 		findObj.user = user;
 		findObj.albums = albums;
 		findObj.images = images;
 		// Записываем данные пользователя в глобальный объект
 		res.locals.userName = findObj.user.name;
	  res.locals.userAbout = findObj.user.about;
	  res.locals.email = req.session.email;
	  res.locals.backgroundIamge = `/id${req.session.user_id}/${commons}/${findObj.user.background}`;
	  res.locals.avatar = `/id${req.session.user_id}/${commons}/${findObj.user.avatar}`;
 		callback();
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
 			async.each(albums,(album,callback_2) => {
 			//console.log(dateFormat(album.created, "HH:MM dd.mm.yyyy"))
 			let newAlbumName = slug(translit.toASCII(album.name));
 			
 			renderObj.albums.push({
 				name: album.name,
 				date : dateFormat(album.created, "HH:MM dd.mm.yyyy"),
 				about: album.about,
 				cover: `/id${req.session.user_id}/${albumsFolder}/${newAlbumName}/${album.cover}`,
 				time: +album.created,
 				imageNumber: (function(){
 					var counter = 0
 					image.forEach(function(item){
 						if(item.album == newAlbumName){
 							counter++;
 						}
 					})
 					return counter;
 				})()
 			})
 			
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