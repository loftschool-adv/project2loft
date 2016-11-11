let async = require('async');
let fs = require('fs');
let config = require('../../config.json');
let User = require('../models/user.js').User;
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let sortBy = require('sort-by');

let folder = config.folder.users;
let albumsFolder = config.folder.albums;
let commons = config.folder.commons;


// Отображаем главную страницу альбомов
let albumRender = function(req,res){
	let urlNameAlbum = req.url.split('/')[1];
	let findObj = {};
	let renderObj = {
		images : []
	};


	async.waterfall([

		function(callback){
			// Начинаем массовый поиск по базе
			async.waterfall([
				function(callback_2){
					User.find({user_id : req.session.user_id}, (err,user) =>{

					}).then((user) => {
						findObj.user = user[0];
						callback_2();
					})
				},
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
				],(err) => {
				if(err) throw err;
				callback();
			})
		},
		function(callback){
			// Формируем данные для вывода
			renderObj.user = {
				name : findObj.user.name,
				avatar: `/id${req.session.user_id}/${commons}/${findObj.user.avatar}`,
			};
			renderObj.album = {
				name : findObj.album.originName,
				about : findObj.album.about,
				cover: findObj.album.cover,
				imagesCount: findObj.images.length + ' ' + base.declOfNum(findObj.images.length, ['фотография','фотографии','фотографий']),
			};
			//renderObj.images = findObj.images
			callback();

		},
		function(callback){
			// Перестраиваем массив фотографий

			async.each(findObj.images,(image,callback_2)=>{

				renderObj.images.push({
					id : image.img_id,
					name: image.name,
					album: image.album,
					user_id: image.user_id,
					src: image.src,
				});
				callback_2();

			},(err)=>{
				callback();
			})

		}


		],(err)=>{
			//console.log(renderObj);
			if(err) throw err;
			res.locals.albumRenderData = renderObj;
			res.locals.page = 'thisUserAlbum';
			res.render('album',  { title: findObj.album.originName})
	})

	
	
};


module.exports = function(req,res){
	albumRender(req,res);
};