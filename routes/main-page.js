'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');



// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/', (req,res) =>{
  res.render('main-page',  { title: 'Главная' });
});

// Выход с сайта 
route.post('/logout/', (req, res) => {
  if (req.body.req == 'logout') {
    req.session.destroy();
    res.send({status: 'logout'});
  }

});
module.exports = route;