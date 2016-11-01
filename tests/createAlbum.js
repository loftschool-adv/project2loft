// Данный скрип работает с базой описанной в moongoose.js
// Скрипт создан в целях тестирования

// Подключаем файл с моделью юзеров
let mongoose = require('../modules/libs/mongoose.js');
let Album = require('../modules/models/album.js').Album;

// Создаем экземпляр пользователя
let album = new Album({
  name : 'Tester',
  user_id: '5814492c3447a7e857388a3d'
});

// Сохраняем пользователя в базу
album.save(function( err, album, affected){
  if (err) throw err;
  console.log('Создан album - Tester')
});