// Модуль создает директорию users(если ее нет), затем наполняет ее папка пользователей.
// В модуль добавлена чистка. Если пользователя не найдено в базе, значит его папка удаляется,
// работает для любых папок, лежащих, как мусор
// Модуль работает при запуке сервера.


let fs = require('fs');
let mongoose = require('mongoose');
let User = require('../modules/models/user.js').User;
let Album = require('../modules/models/album.js').Album;
let BaseModule = require('../modules/libs/_base.js');
let async = require('async');
let base = new BaseModule;
let del = require('del');
let folder = './users';  // Папка с пользователями
let albumFolder = 'albums'; // Папка альбомов
let commonFolder = 'commons'; // Папка с остальными файлами


var debag = true;
var clearStart = false;

let info = function(text,flag) {
	var debug = flag;
	if(debug){
		console.log(text)
	}
}

// Создаем корневую директорию, если ее нет
let createDirUsers = function(callback){
	base.checkDirectory(folder, function(err){
		if(err){
			info('Создаем папку ' + folder ,debag)
			fs.mkdir(folder, () => {
				info('Создали папку' + folder,debag)
			})
		}
	});
	return callback(null);
};

// Генерирем папки пользователей
let createFolder = function(callback){
	User.find({}, (err,items) => {
		if(err) throw err;
		info('Генерируем папки пользователей' + folder + '/',debag);
		async.each(items,(item, itemCallback) =>{
			fs.mkdir(folder + '/id' + item.user_id, (err) => {
				createFolderAlbums(item,itemCallback);
				//albumGenerate(item,itemCallback);
			});
			
		},()=>{
			
			callback();
		})
	})
	
};

// Генерируем папку с альбомами и папку с разными файлами
let createFolderAlbums = function(item,itemCallback){
	fs.mkdir(folder + '/id' + item.user_id + '/' + commonFolder,(err) =>{});
	fs.mkdir(folder + '/id' + item.user_id + '/' + albumFolder,(err) =>{
		albumGenerate(item,itemCallback);
	});
}

// Генерируем папки альбомов
let albumGenerate = function(item,itemCallback){
	Album.find({user_id : item.user_id},(err,albums) =>{
		if(err) throw err;
		async.each(albums, (album,albumCallback) =>{
			fs.mkdir(folder + '/id' + item.user_id + '/' + albumFolder + '/' + album.name, (err) => {
				if(err){
					if(err.errno == -4075){
						itemCallback();
					}
				}else{
					info('Создан альбом id' + item.user_id + '/' + album.name,debag);
					albumCallback();
				}
			});
			
		},() =>{
			info('Папки юзеров созданы',debag);
			itemCallback() 
		})
	})
}




// =============== Clear ===============

// Удаляем мусор из users/
let clearFolder = function(callback){
	let userFolders = fs.readdirSync(folder);
	async.each(userFolders,(userFolder,folderCallback) => {
		User.find({user_id: userFolder.replace('id','')},(err,users) => {
			if(!users || users.length == 0) {
				del.sync([folder + '/' + userFolder]);
				info(folder + '/' + userFolder + ' - удалено', debag)
			}
		}).exec(() =>{
			folderCallback();
		})
	},() => {
		callback();
	})
};

// Удаляем мусор из users/user
let clearUserFolder = function(callback){
	let userFolders = fs.readdirSync(folder);
	async.each(userFolders,(userFolder,folderCallback) => {
		let thisUserFolder = fs.readdirSync(folder + '/' + userFolder);
		async.each(thisUserFolder,(thisFolder,folderCallback) =>{
			if(thisFolder != albumFolder && thisFolder != commonFolder){
				del.sync([folder + '/' + userFolder + '/' + thisFolder]);
			}
		},() =>{
			folderCallback();
		})
		folderCallback();
	},() => {
		callback();
	})
};

// Удаляем мусор из users/user/album
let clearAlbums = function(callback){
	let userFolders = fs.readdirSync(folder);
	async.each(userFolders,(userFolder,folderCallback) => {
		let userAlbums = fs.readdirSync(folder + '/' + userFolder + '/' + albumFolder);
		async.each(userAlbums,(userAlbum,userAlbumCallback) =>{
			Album.find({user_id: userFolder.replace('id',''), name: userAlbum}, (err,albums) =>{
				if(!albums || albums.length == 0) {
					del.sync([folder + '/' + userFolder + '/' + albumFolder +  '/' + userAlbum]);
					info(folder + '/' + userFolder + '/' + albumFolder +  '/' + userAlbum + ' - удалено', true)
				}
			}).exec(() =>{
				userAlbumCallback();
			})
		},() => { folderCallback(); })	
	},() => {
		callback();
	})
};

// Последовательно выполняем фукнкции очистки
let clear = function(callback){
	if(clearStart){
		info("Пошла очистка",debag);
		async.series([
			clearFolder,
			clearUserFolder,
			clearAlbums
		], (err,result) =>{
			info("Очистка завершена",debag);
			callback();
		})
	}else{
		callback();
	}
	
	
};



module.exports = async.series([
		createDirUsers,
		createFolder,
		clear
	], function(err,result){
		info("Скрипт завершен",debag);
});
	