let mongoose = require('./../libs/mongoose.js');
//mongoose.set('debug', true);
let async = require('async');



// Выполняем функции последовательно
// При завершении последней функции скрипт отключит базу.
async.series([
	open,
	dropDatabase,
	requireModels,
	createUsers,
], (err) => {
	console.log("База обновлена");
	mongoose.disconnect();
});



// Открываем соединение с бд
function open(callback){
	mongoose.connection.on('open', callback)
}


// Удаляем старую базу
function dropDatabase(callback){
	let db = mongoose.connection.db;
	db.dropDatabase(callback);
}


// Функция не работает как хотелось бы, пока только устанавливает соединение с моделью user
function requireModels(callback){
	let User = require('../models/user.js').User;
	User.on('index', callback);
}



// Создаем пользователей
function createUsers(callback){
	

	let users = [
		{login : 'Вася', password: '123', email: 'test123@mail.ru'},
		{login : 'Маша', password: 'super', email: 'test@bk.com'},
		{login : 'Петя', password: 'super12', email: 'petya@mail.net'}
	]

	async.each(users, (userData, callback) => {
		let user = new mongoose.models.User(userData);
		user.save(callback);
	},callback);

}
