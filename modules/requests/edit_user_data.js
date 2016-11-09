let fs = require('fs');
let path = require('path');
let async = require('async');
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let User = require('../models/user.js').User;
let multiparty = require('multiparty');
let del = require('del');

let config = require('../../config.json');
let Jimp   = require('jimp');
let folder = config.folder.users;
let commons = config.folder.commons;
let tmpFolder = config.folder.tmp;


// Редактирование данных пользователя
let editUserData = function(req,res){
	let thisUser;
	let resObj = {};
	// Обрабатываем данные через multiparty
	async.waterfall([
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
	    	let tmpPath = `${folder}/id${req.session.user_id}/${tmpFolder}/`;
	    	let commonsPath = `${folder}/id${req.session.user_id}/${commons}/`;
	    	
	    	async.parallel([

	    		function(callback_2){
		    		fs.readdir(tmpPath,(err,items)=>{
				  		if(err) throw err;

				  		async.each(items,(item,callback_3) =>{

				  			if((item.indexOf('avatar-') + 1)){
					  			del([commonsPath + thisUser.avatar]).then(() => {
					  				Jimp.read(tmpPath + '/' + item).then((image)=>{
					  					image.write(commonsPath + '/' + item);
						  				resObj.avatarFile = item;
						  				callback_3();
					  				})
				  				})
				  			}else if((item.indexOf('background-') + 1)){
				  				del([commonsPath + thisUser.background]).then(() => {
					  				Jimp.read(tmpPath + '/' + item).then((image)=>{
					  					image.write(commonsPath + '/' + item);
						  				resObj.backGroundFile = item;
						  				callback_3();
					  				})
				  				})
				  			}else{
				  				callback_3();
				  			}
				  			

				  		},(err) =>{
				  			callback_2();
				  		})
				  		
				  	})



	    		}

	    	],(err) => {
	    		callback();
	    	})
	  },
	  function(callback){
	  	// Устанавливаем Новые данные пользователя в базе
	  	let userName = req.body.userName  || thisUser.name;
	  	let userAbout = req.body.userAbout  || thisUser.about;
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
	  	// Чистим папку tmp
	  	base.clearFolder(`./${folder}/id${req.session.user_id}/${tmpFolder}/`,callback);
	 },
		function(callback){
	    	// Формируем объект для отправки
	    resObj.name = req.body.userName;
	    resObj.about = req.body.userAbout;
	    resObj.avatarFile = `/id${req.session.user_id}/${commons}/` + (resObj.avatarFile || thisUser.avatar);
	    resObj.backGroundFile = `/id${req.session.user_id}/${commons}/` + (resObj.backGroundFile || thisUser.background);
	    callback();
	  },

    ],(err,test)=>{
    	if(err){
    		throw err;
    	}else{
    		res.json(resObj);
    	}
  	})
}


module.exports = function(req, res){
	editUserData(req, res);
}