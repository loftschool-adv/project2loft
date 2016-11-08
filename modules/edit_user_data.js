let fs = require('fs');
let path = require('path');
let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let User = require('./models/user.js').User;
let multiparty = require('multiparty');
let del = require('del');

let config = require('../config.json');
let Jimp   = require('jimp');
let folder = config.folder.users;
let commons = config.folder.commons;
let tmpFolder = config.folder.tmp;


// Редактирование данных пользователя
let editUserData = function(req,res){
	let form = new multiparty.Form();
	let thisUser;
	let resObj = {};
	// Обрабатываем данные через multiparty
	form.parse(req, function(error, fields, files){
		async.waterfall([
	    function(callback){
	    	// При ошибке form data Сразу выкидываем сообщение и прекращаем работу

	    	if(error){
					callback("Ошибка при загурзке");
				}else{
					callback();
				}
	    },
	    function(callback){
	    	// Получаем пользователя из базы
	    	User.findOne({user_id: req.session.user_id},callback)   	
	    },
	    function(user,callback){
	    	// Сохраняем данного пользователя в глобальную переменную
	    	thisUser = user;
	    	// Если папки commons нет, то создаем ее.
	    	base.folderGenerator(`${folder}/id${req.session.user_id}/${commons}/`,callback);
	    },
	    function(callback){
	    	// Перебираем объект файл если он не пустой
	    	let userPath = `${folder}/id${req.session.user_id}/commons/`;
	    	if (Object.keys(files).length != 0) {
	    		async.forEach(files,(file,callback_2)=>{
	    			
						
						  // Сохраняем файл
					    Jimp.read(file[0].path).then(function(image){
		            //image.resize(500, Jimp.AUTO);
		            if(file[0].fieldName == "userBackGround"){
						  		let newBackGroundPath = 'background-' + base.passGenerate(4) + path.extname(file[0].path);
						  		image.write(userPath + newBackGroundPath);
						  		resObj.backGroundFile = newBackGroundPath;
								}
								if(file[0].fieldName == "userAvatar"){
									let newAvatarPath = 'avatar-'+ base.passGenerate(4) + path.extname(file[0].path);
									image.write(userPath + newAvatarPath);
									resObj.avatarFile = newAvatarPath;
								}
		            callback_2();
				      });

	    		},() =>{
	    			callback();
	    		})
				}else{
					// Если файлов нет, продолжаем работу
					callback();
				}
	    },
	  function(callback){
	  	// Устанавливаем Новые данные пользователя в базе
	  	let userName = fields.userName[0]  || thisUser.name;
	  	let userAbout = fields.userAbout[0]  || thisUser.about;
	  	let userAvatar = resObj.avatarFile  || thisUser.avatar;
	  	let userBackGround = resObj.backGroundFile  || thisUser.background;

	  	User.update({user_id: req.session.user_id},{$set:{
	  		name: userName,
	  		about: userAbout,
	  		avatar: userAvatar,
	  		background: userBackGround

	  	}},callback)


	  
	  	
	  },
	  function(affected,callback){
	  	// Чистим старые файлы background если они есть
	  	async.parallel([
	  		function(callback_2){
	  			if(resObj.avatarFile){
			  		let avatarFolder = `./${folder}/id${req.session.user_id}/${commons}/`;
				  	fs.readdir(avatarFolder,(err,items)=>{
				  		if(err) throw err;
				  		async.each(items,(item,callback_3) =>{
				  			if(item.indexOf('avatar-') + 1){
				  				del([avatarFolder + item, "!"+avatarFolder + resObj.avatarFile]).then(() => {
				  					callback_3();
				  				});
				  			}
				  		})
				  		callback_2();
				  	})
			  	}else{
			  		callback_2();
			  	}

	  		},
	  		function(callback_2){
	  			// Чистим старые файлы avatar если они есть
	  			if(resObj.backGroundFile){
			  		let avatarFolder = `./${folder}/id${req.session.user_id}/${commons}/`;
				  	fs.readdir(avatarFolder,(err,items)=>{
				  		if(err) throw err;
				  		async.each(items,(item,callback_3) =>{
				  			if(item.indexOf('background-') + 1){
				  				del([avatarFolder + item, "!"+avatarFolder + resObj.backGroundFile]).then(() => {
				  					callback_3();
				  				});
				  			}
				  		})
				  		callback_2();
				  	})
			  	}else{
			  		callback_2();
			  	}

	  		},

	  		],(err) =>{
	  			callback();
	  	})
	  },
	  function(callback){
	  	// Чистим папку tmp
	  	base.clearFolder(`./${folder}/id${req.session.user_id}/${tmpFolder}/`,callback);
	  },
	  function(callback){
	    	// Формируем объект для отправки
	    resObj.name = fields.userName[0];
	    resObj.about = fields.userAbout[0];
	    resObj.avatarFile = `/id${req.session.user_id}/${commons}/` + resObj.avatarFile;
	    callback();
	  },

    ],(err,test)=>{
    	if(err){
    		throw err;
    	}else{
    		res.json(resObj);
    	}
  	})
	});

  

}


module.exports = function(req, res){
	editUserData(req, res);
}