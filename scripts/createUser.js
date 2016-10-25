// Данный скрип работает с базой описанной в moongoose.js
// Скрипт создан в целях тестирования

// Подключаем файл с моделью юзеров
let mongoose = require('./../libs/mongoose.js');
let User = require('../models/user.js').User;

// Создаем экземпляр пользователя
let user = new User({
    login : 'Tester',
    password: 'secret'
})

// Сохраняем пользователя в базу
user.save(function( err, user, affected){
    if (err) throw err;
    console.log('Создан user - Tester')
});

