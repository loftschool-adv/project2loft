'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let route = require('express').Router();


// Главная страница пользователя
// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/main-page.pug



route.get('/', (req,res,next) =>{
	require('../modules/render/main-page_render.js')(req,res,next);
});


// Редактируем данные пользователя
route.post('/editUserData/', (req, res) => {
	require('../modules/requests/edit_user_data.js')(req,res);
});

// Редактируем социальные сети пользователя
route.post('/changeSocial/', (req, res) => {
	require('../modules/requests/change_social.js')(req,res);
});

// Очищаем tmp папку пользователя
route.post('/clearTmp/', (req,res,next) =>{
	require('../modules/requests/clear_tmp.js')(req,res);
});


// Реакция на изменение обложки аватарки
route.post('/changePhoto/', (req,res) =>{
	//console.log(req.session);
	require('../modules/requests/change_photo.js')(req,res);
});

// Реакция на изменение обложки альбома
route.post('/addAlbumCover/', (req,res) =>{
	//console.log(req.session);
	require('../modules/requests/add_new-album_cover.js')(req,res);
});

//Добавляем новый альбом
route.post('/addAlbum/', (req,res) =>{
	//console.log(req.session);
	require('../modules/requests/create_album.js')(req,res);
});

// Выход с сайта 
route.post('/logout/', (req, res) => {
  require('../modules/logout.js')(req,res);
});

module.exports = route;