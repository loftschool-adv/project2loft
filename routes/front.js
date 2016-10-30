// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';

let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');



// Обращаемся к корню сайта , и рендерим шаблон из ./templates/pages/index.pug
route.get('', (req,res) =>{
	res.render('index',  { title: 'Express' });
});
// Обращаемся к странице USER , и рендерим шаблон из ./templates/pages/index.pug
route.get('/user', (req,res) =>{
	res.render('pages/user',  { title: 'User' });
});

// Обращаемся к странице SEARCH , и рендерим шаблон из ./templates/pages/index.pug
route.get('/search', (req,res) =>{
	res.render('pages/search',  { title: 'Search' });
});

module.exports = route;