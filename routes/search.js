
let express = require('express');
let route = require('express').Router();
//let mongoose = require('mongoose');

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/', (req,res) =>{
    res.render('search',  { title: 'Search' });
});

module.exports = route;