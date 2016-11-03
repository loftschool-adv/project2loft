'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/user.pug
route.get('/', (req,res) =>{
    res.render('user',  { title: 'Пользователь' });
});


module.exports = route;
