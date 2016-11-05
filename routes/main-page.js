'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
let async = require('async');
let User = require('../modules/models/user.js').User;
let Album = require('../modules/models/album.js').Album;
let BaseModule = require('../modules/libs/_base.js');
let multiparty = require('multiparty');
let base = new BaseModule;
let path = require('path');
let fs = require('fs');


// Главная страница пользователя
// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/main-page.pug


// ========== Фунции ==========



// ========== Роуты ==========




route.get('/', (req,res,next) =>{
	if(req.baseUrl != '/id' + req.session.user_id){
		next();
	}else{
		async.waterfall([
	    function(callback){
	    	// Ищем данного пользователя в базе
	      User.find({email: req.session.email},callback)
	    },
	    function(user,callback){
	    	//res.locals.userName = user[0].name;
	    	//res.locals.userAbout = user[0].about;
	    	callback();
	    },
	    function(callback){
	    	fs.readdir(`users/id${req.session.user_id}/commons/`, function(err,files){
	    		if(err) throw err;
	    		async.each(files,(file,fileCalbak) =>{
	    			let fileName = file.split('.')[0];
	    			if(fileName == 'background'){
	    				res.locals.backgroundIamge = `/id${req.session.user_id}/commons/${file}`;
	    				fileCalbak();
	    			}
	    		});
	    		callback();
 	    	})
	    	
	    }
	  ],function(err,arg){
	  	res.render('main-page',  { title: 'Главная' })
	  })
	}
});


// Редактируем данные пользователя
route.post('/editUserData/', (req, res) => {
	let form = new multiparty.Form();
	form.parse(req, function(err, fields, file){
		if(err){
			return res.json({ error: "Ошибка при загрузке"})
		}
		User.findOneAndUpdate({user_id: req.session.user_id},
			{$set : 
				{
					name: fields.userName[0],
					about: fields.userAbout[0]
				}
			}
			,(err,user)=>{
				if(err) throw err;
				res.locals.userName = fields.userName[0];
				res.locals.userAbout = fields.userAbout[0];


				/*base.checkDirectory(`users/id${req.session.user_id}/commons/`, function(err){
					if(err){
						console.log('Папки нет');
					}
				});*/


				if (Object.keys(file).length != 0) {
					let pictures = file.userBackGround.filter(f => f.size).map((file, key) => {
					let newFilePath = 'background' + path.extname(file.path);
					fs.writeFile(path.resolve(`users/id${req.session.user_id}/commons/`, newFilePath), fs.readFileSync(file.path));
						res.send({});
					})
				}
			})
	})
	

});

route.post('/addAlbum/', (req,res) =>{
	//console.log(req.session);
	// Создаем экземпляр пользователя
	let album = new Album({
		name : req.body.name,
		about: req.body.about,
		user_id: req.session.user_id
	});
	// Сохраняем пользователя в базу
	album.save(function( err, album, affected){
		if (err) throw err;
		console.log('Создан альбом');
		res.end('end');
	});
});

// Выход с сайта 
route.post('/logout/', (req, res) => {
  require('../modules/logout.js')(req,res);
});

module.exports = route;