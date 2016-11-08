'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
let async = require('async');
let User = require('../modules/models/user.js').User;
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;

// Приходим сюда , если в ссылке не ваш id




// ========== Фунции ==========



// ========== Роуты ==========




route.get('/', (req,res,next) =>{
	async.waterfall([
	  function(callback){
	    // Ищем данного пользователя в базе
	    base.findOneDB(User,callback,{user_id: req.baseUrl.replace('/id','')});
	  },
	    function(user,callback){
	    	if(user.length != 0){
	  			res.render('user',  {
	  			 userNameOther: user[0].name,
	  			 userAboutOther: user[0].about,
	  			});
	  		}else{
	  			res.send('Пользователь не найден')
	  		}
	    },
	  ],function(err,arg){
	  	
	  	
	  })
});



module.exports = route;
