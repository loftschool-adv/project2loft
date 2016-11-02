// Модуль создает директорию users(если ее нет), затем наполняет ее папка пользователей.
// В модуль добавлена чистка. Если пользователя не найдено в базе, значит его папка удаляется,
// работает для любых папок, лежащих, как мусор
// Модуль работает при запуке сервера.


let fs = require('fs');
let mongoose = require('mongoose');
let User = require('../modules/models/user.js').User;
let BaseModule = require('../modules/libs/_base.js');
let async = require('async');
let base = new BaseModule;
let folder = './users';  // Папка с пользователями



	


let createDirUsers = function(callback){
	base.checkDirectory(folder, function(err){
		if(err){
			fs.mkdir(folder, () => {})
		}
	});
	callback();
};

let createFolder = function(callback){
	User.find({}, (err,items) => {
		items.forEach((item) =>{
			fs.mkdir(folder + '/' + item.email, () => {});
		})
	}).then(() => {
		callback();
	});
	
};

let clear = function(callback){
	fs.readdirSync(folder).forEach(function(UserFolder){
		User.find({email:UserFolder},(err,item) => {
			if(item.length == 0) { 
				fs.rmdirSync(folder + '/' + UserFolder);
				callback();
			}
		})
	});	
};



module.exports = async.series([
		createDirUsers,
		createFolder,
		clear
	], function(err,result){
});
	