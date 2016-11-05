let fs = require('fs');
let path = require('path');
let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let User = require('./models/user.js').User;
let multiparty = require('multiparty');
let form = new multiparty.Form();
let config = require('../config.json');

let folder = config.folder.users;
let commons = config.folder.commons;



// Редактирование данных пользователя
let editUserData = function(req,res){
	// Обрабатываем данные через multiparty
	form.parse(req, function(error, fields, file){
		var fstream = null;
		async.waterfall([
	    function(callback){
	    	// При ошибке form data Сразу выкидываем сообщение и прекращаем работу
	    	if(error){
	    		if(error)throw error;
					callback("Ошибка при загрузке");
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
	    	/*if (Object.keys(file).length != 0) {
	    		file.userBackGround.map((file, key) =>{
	    			callback(null,file)
	    		});
				}else{
					callback(null,false);
				}*/
				//let userFolder = `${folder}/id${req.session.user_id}/${commons}/`;
				//let newFilePath = 'background' + path.extname(file.path);
				
				let userFolder = `${folder}/id${req.session.user_id}/${commons}/`;
				if (Object.keys(file).length != 0) {
					let pictures = file.userBackGround.filter(f => f.size).map((file, key) => {
					let newFilePath = 'background' + path.extname(file.path);
					fs.writeFile(path.resolve(`users/id${req.session.user_id}/commons/`, newFilePath), fs.readFileSync(file.path));
						callback();
					})
				}
	    },
	    /*function(file,callback){
	    	// Создаем файл
	    	let newFilePath = 'background' + path.extname(file.path);
	    	let userFolder = `${folder}/id${req.session.user_id}/${commons}/`;
	    	fs.writeFile(path.resolve(userFolder, newFilePath),fs.readFileSync(file.path));
	    	callback();
	    },*/

    ],(err)=>{
    	if(err){
    		if(error)throw error;
    		return res.json({ error: err})
    	}else{
    		console.log('Пришло');
    		
    	}
  	})


	});

  return res.send({});

}

let test = function(req, res){
	form.parse(req, function(err, fields, file){
		if(err){
			if(err)throw err;
			return res.json({ error: "Ошибка при загрузке"})
		}
		User.findOneAndUpdate({user_id: req.session.user_id},
			{$set : 
				{
					name: fields.userName[0],
					about: fields.userAbout[0]
				}
			}
			,(err,user)=>{
				if(err) throw err;
				res.locals.userName = fields.userName[0];
				res.locals.userAbout = fields.userAbout[0];


				base.checkDirectory(`users/id${req.session.user_id}/commons/`, function(err){
					if(err){
						console.log('Папки нет');
					}
				});


				if (Object.keys(file).length != 0) {
					let pictures = file.userBackGround.filter(f => f.size).map((file, key) => {
					let newFilePath = 'background' + path.extname(file.path);
					fs.writeFile(path.resolve(`users/id${req.session.user_id}/commons/`, newFilePath), fs.readFileSync(file.path));
						res.send({});
					})
				}
			})
	})
}


module.exports = test;