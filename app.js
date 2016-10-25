'use strict'

let fs = require('fs');
let path = require('path');
let express = require('express');
let pug = require('pug');
let config = require('./config.json');
let app = express();
let mongoose = require('./mongoose.js');
let bodyParser = require('body-parser');

// Лог , вместо console.log пишем log.info. Разница в том, что будет показан путь до файла из которого
// вызываеться log. По умолчанию выводиться два последних элемента пути.
let log = require('./libs/log')(module);






// Покдлючаем шаблонизатор
app.set('view engine', 'pug');
// Указываем, откуда брать шаблоны
app.set('views', path.resolve(config.http.templatesRoot + "/pages/"));


app.use(express.static(path.resolve(config.http.publicRoot)));
// Парсим запросы, лимит на загрузку файлов в MB, указываеться тут же
app.use(bodyParser.json());



//===маршруты===
app.use('/', require('./routes/front.js'));
//=============



//===Проверка на ошибки (тестовый вариант нужно дорабатывать)===

app.use((req, res, next) => res.status(404).send('Не удается найти страницу!'));

app.use((err,req,res,next) =>{
	res.status(500);
	res.render('error', {error : err.message});
	console.error(err.message,err.stack);
})

//=============



// Запускаем сервак на порту 4000 ( из конфига)
app.listen(config.http.port,config.http.host, function () {
  log.info('Example app listening on port ' + config.http.port);
});


/*
===================================================
================ Инструкция =======================
===================================================
=  1) Точка входа файл app.js , запускается       =
=  классически 'node app.js'.                     =
=                                                 =
=  2) Все маршруты описываются в папке routers    =
=                                                 =
=  3) Все важные настройки вынесены в файл        =
=  config.json , который лежит в корне.           =
=                                                 =
=  4) Схемы моделей описываются в папке models.   =
=                                                 =
=  5) Шаблоны pug лежат в папке templates         =
=                                                 =
=  6) Вся статика лежит в public и автоматически  =
=  поддтягивается на серве                        =
=                                                 =





*/