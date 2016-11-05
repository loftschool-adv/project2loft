// Модуль создает директорию users(если ее нет), затем наполняет ее папка пользователей.
// В модуль добавлена чистка. Если пользователя не найдено в базе, значит его папка удаляется,
// работает для любых папок, лежащих, как мусор
// Модуль работает при запуке сервера.


let fs = require('fs');
let mongoose = require('mongoose');
let config = require('../config.json');
let User = require('../modules/models/user.js').User;
let Album = require('../modules/models/album.js').Album;
let BaseModule = require('../modules/libs/_base.js');
let async = require('async');
let base = new BaseModule;
let del = require('del');
let folder = './' + config.folder.users;  // Папка с пользователями
let albumFolder = config.folder.albums; // Папка альбомов
let commonFolder = config.folder.commons; // Папка с остальными файлами
let tmpFolder = config.folder.tmp; // Папка с временными файлами



var debag = false;
var clearStart = false;
var generateStart = true;

// Информация при дебаге
let info = function(text,flag) {
	var debug = flag;
	if(debug){
		console.log(text)
	}
}



// Создаем корневую директорию, если ее нет
let createDirUsers = function(callback_1){
	async.parallel([
		function(callback_2){
			base.folderGenerator(folder,callback_2);
		}
	], (err,result) =>{
		// Вызвать колбек по завершение создания папки
		callback_1();
	})
};




// Генерирем папки пользователей
let createUserFolder = function(users,callback_1){
		// Проходимся циклом по всем пользователям
	async.each(users,(item, callback_2) =>{
			// Если папка по id + user_id есть то проверяем дальше
			let userDir = folder + '/id' + item.user_id;
			async.parallel([
      			function(callback_3){
      				base.folderGenerator(userDir,callback_3);
      			}
					], (err,result) =>{
						// Вызвать колбек по завершение создания папки
						callback_2();
					})
		},()=>{
			// Вызываем коллбек чтобы перейти к следующий функции
			callback_1(null,users);
		})
	
};







// Генерируем папку с альбомами , папку с разными файлами и папку tmp
let createInnerFolder = function(users,callback_1){
	// Проходимся циклом по всем пользователям
	async.each(users,(user, callback_2) =>{
		let userFolder = folder + '/id' + user.user_id + '/';
		// Паралельно запускаем создание папкок
		async.parallel([
			function(callback_3){
				// Создаем фременную папку в директории пользователя
				base.folderGenerator(userFolder + tmpFolder,callback_3)
			},
			function(callback_3){
				// Создаем папку для разных файлов в директории пользователя
				base.folderGenerator(userFolder + commonFolder,callback_3)
			},
			function(callback_3){
				// Создаем папку для альбомов в директории пользователя
				base.folderGenerator(userFolder + albumFolder,callback_3)
			}

		],() =>{
			callback_2();
		})
	},() =>{

		callback_1();
	})
}


// Генерируем папки самих альбомов
let createAlbums = function(albums,callback_1){
	async.parallel([
			function(callback_2){
				// Сканируем папку user
				fs.readdir(folder,function(err,items){
					// Проходимся циклом по всем папкам id
					async.each(items,(item,callback_3) =>{
						// Проходимся циклом по свем альбомам
						async.each(albums,(album,callback_4) =>{
							// Сравниваем папку с id альбома
							if(item.replace('id','') == album.user_id){
								// Если упешно, создаем папку альбома с папке users/id*/albums/
								let albumDir = folder + '/' + item + '/' + albumFolder + '/' + album.name;
								base.folderGenerator(albumDir,callback_4)
							}else{
								callback_4();
							}
						},()=>{ 
							callback_3() 
						})
					},() =>{
						callback_2();
					})
				})
			}
		],() =>{
			callback_1();
	})
}






// Последовательно выполняем фукнкции Генерации папок
let generate = function(callback_1){
	if(generateStart){
		async.waterfall([

			function(callback_2){
				createDirUsers(callback_2);
			},
			function(callback_2){
				User.find({},callback_2)
			},
			function(users,callback_2){
				createUserFolder(users,callback_2);
			},
			function(users,callback_2){
				createInnerFolder(users,callback_2);
			},
			function(callback_2){
				Album.find({},callback_2)
			},
			function(albums,callback_2){
				createAlbums(albums,callback_2);
			}
			

		], (err,result) =>{
			callback_1();
		})
	}else{
		callback_1();
	}
	
	
};

















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
		generate
		//clear
	], function(err,result){
		info("Скрипт завершен",debag);
});
	