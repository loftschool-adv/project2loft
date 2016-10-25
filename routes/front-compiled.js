// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта


'use strict';

var route = require('express').Router();
var mongoose = require('mongoose');

// Обращаемся к корню сайта , и рендерим шаблон из ./templates/pages/index.pug
route.get('', function (req, res) {
	res.render('index');
});

module.exports = route;

//# sourceMappingURL=front-compiled.js.map