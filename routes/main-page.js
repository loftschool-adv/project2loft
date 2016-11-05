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



route.get('/', (req,res,next) =>{
	require('../modules/main-page_render.js')(req,res,next);
});


// Редактируем данные пользователя
route.post('/editUserData/', (req, res) => {
	require('../modules/edit_user_data.js')(req,res);
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