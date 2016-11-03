'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
let async = require('async');
let User = require('../modules/models/user.js').User;
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;


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
	      base.findOneDB(User,callback,{email: req.session.email});
	    },
	    function(user,callback){
	    	res.locals.userName = user[0].name
	    	callback();
	    }
	  ],function(err,arg){
	  	console.log('Пошел рендер');
	  	res.render('main-page',  { title: 'Главная' })
	  })
	}
	
  //res.render('main-page',  { title: 'Главная' });
});







// Выход с сайта 
route.post('/logout/', (req, res) => {
  if (req.body.req == 'logout') {
    req.session.destroy();
    res.send({status: 'logout'});
  }

});
module.exports = route;