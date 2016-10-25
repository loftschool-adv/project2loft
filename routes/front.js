// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта


'use strict'
let route = require('express').Router();
let mongoose = require('mongoose');



// Обращаемся к корню сайта , и рендерим шаблон из ./templates/pages/index.pug
route.get('', (req,res) =>{
	res.render('index');
})


module.exports = route;