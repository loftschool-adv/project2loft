'use strict';
// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта

// let fs         = require('fs');
// let path       = require('path');
// let formidable = require('formidable');
// let util       = require('util');
let express = require('express');
let route = require('express').Router();
let uploadImg = require('../modules/upload-img.js');
// var counter = 0;
//let mongoose = require('mongoose');

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/', (req,res) =>{
  res.render('upload',  { title: 'Upload' });
});

route.post('/', (req, res) => uploadImg(req, res));

module.exports = route;