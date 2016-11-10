let async = require('async');
let fs = require('fs');
let config = require('../../config.json');
let User = require('../models/user.js').User;
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let Social = require('../models/social.js').Social;
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
	let renderObj = {
		user: {},
		albums : ''
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
 		// Если все совпало начинаем искать в базе
 		async.waterfall(
 			[
 				function(callback_2){
 					User.findOne({user_id : req.session.user_id},(err,user)=>{
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
 				},
 				function(user,albums,images,callback_2){
 					Social.find({user_id : req.session.user_id},(err,socials)=>{
 						callback_2(null,user,albums,images,socials)
 					});
 				}

 			],
 		(err,user,albums,images,socials)=>{
 			callback(null,user,albums,images,socials);
 		})
 	},
 	function(user,albums,images,socials,callback){
 		//Записываем данные из базы в объекты(на всякий пожарный)
 		findObj.user = user;
 		findObj.albums = albums;
 		findObj.images = images;
 		findObj.socials = socials;
 		// Записываем данные пользователя в глобальный объект для pug файлов
 		//console.log(user);
		renderObj.user.name = findObj.user.name;
	  renderObj.user.about = findObj.user.about;
	  renderObj.user.background = `/id${req.session.user_id}/${commons}/${findObj.user.background}`;
	  renderObj.user.avatar = `/id${req.session.user_id}/${commons}/${findObj.user.avatar}`;
		renderObj.user.socials = {};
		renderObj.user.socials.vk = {
			link: findObj.socials[0].vk.link,
	  	title: findObj.socials[0].vk.name
		};
		renderObj.user.socials.fb = {
			link: findObj.socials[0].facebook.link,
	  	title: findObj.socials[0].facebook.name
		};
		renderObj.user.socials.tw = {
			link: findObj.socials[0].twitter.link,
	  	title: findObj.socials[0].twitter.name
		};
		renderObj.user.socials.google = {
			link: findObj.socials[0].google.link,
	  	title: findObj.socials[0].google.name
		};
		renderObj.user.socials.email = {
			link: findObj.socials[0].email.link,
	  	title: findObj.socials[0].email.name
		};

		//console.log(renderObj.user.email)


		/*{
	  	
	  }*/
	  //
 		callback();
 	},
 	function(callback){
 		// Сортируем вывод альбомов по дате
 		renderObj.albums = findObj.albums.sort(sortBy('-created'))

 		// Наполняем альбомы дополнительными данными
 		async.each(findObj.albums,(album,callback_2) => {
 			let index = findObj.albums.indexOf(album);
 			renderObj.albums[index].imageCount = 0;
 			let counter = 0;
 			async.each(findObj.images,(image,callback_3) =>{
 				if(album.name == image.album){					
 					counter++;			
 				}
 			})
 			renderObj.albums[index].imageCount = counter++;


 			callback_2();
 		},(err)=>{
 			if(err) throw err;
 			callback();
 		})
 		
 		
 	}



 	],(err)=>{
 		if(err) throw err;
 		// Если все окей отображаем, страницу пользователя
 		res.locals.mainPageData = renderObj;
 		res.render('main-page',  { title: 'Главная' })
 })
};


module.exports = function(req,res,next){
	mainPageRender(req,res,next);
};