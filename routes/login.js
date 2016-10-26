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

// Обращаемся к корню сайта , и рендерим шаблон из ./templates/pages/index.pug
/*route.get('', (req,res) =>{
	res.render('index',  { title: 'Express' });
});*/

route.get('', (req,res) =>{
	res.render('index');
});


// Регистрация новых пользоватей
route.post('/reg/', (req,res) =>{
	let User = require('../models/user.js').User;
	for(let key in req.body){
		if(!req.body[key]){
			return sendMasage('Заполнены не все поля' , res, 1);
			//return res.json({ message: 'Заполнены не все поля' });
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



module.exports = route;