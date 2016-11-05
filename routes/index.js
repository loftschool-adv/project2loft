// Стандартный файл с описанием маршрута.
// В данном файле описано обращение к корню сайта
'use strict';
let route = require('express').Router();




// Отображение главной страницы
route.get('/', (req, res) => {
// Передаем данные в модуль, который определяет авторизацию пользователя
 require('../modules/index-page_render.js')(req, res);
});


// Регистрация новых пользоватей
route.post('/reg/', (req, res) => {
  // Передаем данные в модуль регистрации
  require('../modules/registration.js')(req, res);
});


// Вход на сайт 
route.post('/login/', (req, res) => {
  // Передаем данные в модуль авторизации
  require('../modules/login.js')(req, res);
});



// Васстоновление пароля
route.post('/recover/', (req, res) => {
  // Передаем данные в модуль восстановления пароля
  require('../modules/recover.js')(req, res);
});

module.exports = route;