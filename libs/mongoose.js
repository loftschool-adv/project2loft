// Файл базы данных
// Данный файл следует подключать везде, где нужна база
// Пример:
// let mongoose = require('./mongoose.js');
// Все данные беруться из конфига.


'use strict'

let mongoose = require('mongoose');
let config = require('../config.json');
let options = {
	user: config.db.user,
	pass: config.db.password
};
let host = config.db.host;
let port = config.db.port;
let db = config.db.name;


mongoose.connect(`mongodb://${host}:${port}/${db}`, options)
	.catch(e => {
		console.error(e);
		throw e;
	});

module.exports = mongoose;