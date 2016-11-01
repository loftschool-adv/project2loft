'use strict';

let express = require('express');
let route = require('express').Router();
let uploadImg = require('../modules/upload-img.js');
// var counter = 0;
//let mongoose = require('mongoose');

// Обращаемся к корню сайта , и рендерим шаблон из ./views/pages/index.pug
route.get('/', (req,res) =>{
  res.render('upload',  { title: 'Upload' });
  // console.log(req.session._id);
});

route.post('/', (req, res) => uploadImg(req, res));

module.exports = route;