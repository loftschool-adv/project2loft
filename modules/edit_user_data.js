let fs = require('fs');
let path = require('path');
let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let User = require('./models/user.js').User;
let multiparty = require('multiparty');

let config = require('../config.json');
let Jimp   = require('jimp');
let folder = config.folder.users;
let commons = config.folder.commons;


// Редактирование данных пользователя
let editUserData = function(req,res){
	let form = new multiparty.Form();
	// Обрабатываем данные через multiparty
	form.parse(req, function(error, fields, file){
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
	    	// Заменяем данные пользователя
	    	User.findOneAndUpdate(
		    	{user_id: req.session.user_id},
		    	{$set : 
						{
							name: fields.userName[0],
							about: fields.userAbout[0]
						}
					},callback
				)

	    },
	    function(user,callback){
	    	// Если папки commons нет, то создаем ее.
	    	base.folderGenerator(`${folder}/id${req.session.user_id}/${commons}/`,callback);
	    },
	    function(callback){
	    	// Перебираем объект файл если он не пустой
	    	if (Object.keys(file).length != 0) {
	    		file.userBackGround.map((file, key) =>{
	    			callback(null,file)
	    		});
				}else{
					// Отправляем файл для сохранения
					callback(null,false);
				}
	    },
	    function(file,callback){
	    	let userPath = `users/id${req.session.user_id}/commons/`;
	    	let newFilePath = 'background' + path.extname(file.path);
	    	// Сохраняем файл
	    	Jimp.read(file.path).then(function(image){
            //image.resize(500, Jimp.AUTO);
            image.write(userPath + newFilePath);
            callback();
        });
	    },

    ],(err)=>{
    	if(err){
    		res.json({ error: err})
    	}else{
    		res.send({});
    	}
  	})


	});

  

}


module.exports = function(req, res){
	editUserData(req, res);
}