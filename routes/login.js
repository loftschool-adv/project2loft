// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';

let express = require('express');
let route = require('express').Router();
let mongoose = require('mongoose');



// Обращаемся к корню сайта , и рендерим шаблон из ./templates/pages/index.pug
/*route.get('', (req,res) =>{
	res.render('index',  { title: 'Express' });
});*/

route.get('', (req,res) =>{
	res.render('reg');
});


// Регистрация новых пользоватей
route.post('/reg/', (req,res) =>{
	let User = require('../models/user.js').User;
	for(let key in req.body){
		if(!req.body[key]){
			return res.json({ message: 'Заполнены не все поля' });
		};
	}
	User.findOne({'login' : req.body.login}).then((item) => {
		if(item){
			return res.json({ message: 'Такой пользователь уже существует' });
		}else{
			let user = new User({
			    login : req.body.login,
			    password: req.body.pass,
			    email : req.body.email
			})
			user.save(function( err, user, affected){
    		if (err) throw err;
    		return res.json({ message: 'Вы успешно зарегистрированы' });
			});
		}
	})
});



module.exports = route;