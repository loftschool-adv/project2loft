// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';

let express = require('express');
let route = require('express').Router();
let mongoose = require('mongoose');



let sendMasage = function(message, res, status = 0){
	res.json(
		{ 
			message: message,
			status: status
		})
};


route.get('', (req,res) =>{
	if(!req.session.user){
		res.render('index');
	}else{
		res.render('user');
	}
});


// Регистрация новых пользоватей
route.post('/reg/', (req,res) =>{
	let User = require('../models/user.js').User;
	for(let key in req.body){
		if(!req.body[key]){
			return sendMasage('Заполнены не все поля' , res, 1);
		}
	}
	User.findOne({'login' : req.body.login}).then((item) => {
		if(item){
			return sendMasage('Такой пользователь уже существует' , res , 2);
		}else{
			if(Object.keys(req.body.pass).length < 8){
				return sendMasage('Пароль должен содержать не менее 8 символов' , res , 3);
			}
			let user = new User({
			    login : req.body.login,
			    password: req.body.pass,
			    email : req.body.email
			});
			user.save(function( err, user, affected){
    		if (err) throw err;
    			return sendMasage('Вы успешно зарегистрированы' , res);
			});
		}
	})
});


// Вход на сайт 
route.post('/login/', (req,res) =>{
	let User = require('../models/user.js').User;


	User.findOne({'email' : req.body.email}).then((item) =>{
		console.log(req.body);
		if(item){
			console.log(item);
			if(item.checkPassword(req.body.pass)){
				req.session.user = req.body.email;
				res.send({status: 'login'});
			}
			else{
				return sendMasage('Не верный пароль' , res);
			}
			
		}else{
			console.log("Такой пользователь НЕ найден");
			res.send({});
		}
	});

});

// Выход с сайта 
route.post('/logout/', (req,res) =>{
	if(req.body.req == 'logout'){
		req.session.destroy();
		res.send({status: 'logout'});
	}

});



module.exports = route;