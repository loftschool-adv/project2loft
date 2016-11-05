let async = require('async');
let fs = require('fs');
let config = require('../config.json');
let User = require('./models/user.js').User;

let folder = config.folder.users;
let commons = config.folder.commons;


// Отображаем главную страницу пользователя
let mainPageRender = function(req,res,next){
 async.waterfall([
 	function(callback){
 		// Если сессия не совпадаем с id в ссылке, передаем управление в роутер user
 		if(req.baseUrl != '/id' + req.session.user_id){
			next();
		}else{
			callback();
		}
 	},
 	function(callback){
 		// Если все совпало начинаем искать пользователя в базе
 		User.findOne({email: req.session.email},callback)
 	},
 	function(user,callback){
 		// Записываем данные пользователя в глобальный объект, для доступа ко всем шаблонам
 		res.locals.userName = user.name;
	  res.locals.userAbout = user.about;
	  res.locals.email = req.session.email;
	  callback(null,user)
 	},
 	function(user,callback){
 		// Сканируем папку сommons
 		fs.readdir(`${folder}/id${req.session.user_id}/${commons}/`, callback)
 	},
 	function(files,callback){
 		// Пробегаемся по полученным файлам
 		async.each(files,(file,callback_2) => {
 			//Получаем имя файла
 			let fileName = file.split('.')[0];
 			if(fileName == 'background'){
 				// Если файл равен background, значит это фон шапки. Записываем его путь глобально
				res.locals.backgroundIamge = `/id${req.session.user_id}/${commons}/${file}`;
	    }
	    if(fileName == 'avatar'){
 				// Если файл равен background, значит это фон шапки. Записываем его путь глобально
				res.locals.avatar = `/id${req.session.user_id}/${commons}/${file}`;
	    }
	    callback_2();
 		},() =>{
 			// Когда закончим с файлами, пойдем дальше
 			callback();
 		})
 	}




 	],(err)=>{
 		if(err) throw err;
 		// Если все окей отображаем, страницу пользователя
 		res.render('main-page',  { title: 'Главная' })
 })
}


module.exports = function(req,res,next){
	mainPageRender(req,res,next);
}