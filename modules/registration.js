let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let config = require('../config.json');
let folder = './' + config.folder.users;  // Папка с пользователями
let User = require('./models/user.js').User;



// Регистрация пользователей
let registration = function(req,res){
	async.waterfall([
    // Запускаем функции
    function(callback){
      // Ищем пользователя по email
      User.findOne({'email': req.body.email},callback)
    },
    function(user,callback){
      // Если находим, выдаем ошибку
      if(user){
        callback('Такой email уже зарегитрирован')
      }else{
        // Если не находим, продолжаем работу
        callback();
      }
    },
    function(callback){
      // Создаем модель пользователя для сохранения
      let user = new User({
        name: req.body.login,
        password: req.body.pass,
        email: req.body.email
      });
      req.session.user_id = user.user_id;
      req.session.email = user.email;
      // Сохраняем пользователя
      user.save(callback)
    },
    function(user,affected,callback){
      // Записываем данные сохраненного пользователя в сессию
      req.session.user_id = user.user_id;
      req.session.email = user.email;
      callback(null,user);
    },
    function(user,callback){
      // Создаем папку tmp
      let userFolder = folder + '/id' + user.user_id;
      async.parallel([
      	function(callback_2){
          // Создаем папку пользователя
          base.folderGenerator(folder,callback_2);
        },
        function(callback_2){
          // Создаем папку пользователя
          base.folderGenerator(userFolder,callback_2);
        },
        function(callback_2){
          // Создаем папку tmp
          base.folderGenerator(userFolder + '/' + config.folder.tmp,callback_2);
        },
        function(callback_2){
          // Создаем папку albums
          base.folderGenerator(userFolder + '/' + config.folder.albums,callback_2)
        },
        function(callback_2){
          // Создаем папку commons
          base.folderGenerator(userFolder + '/' + config.folder.commons,callback_2)
        }
      ], (err,result) =>{
        // Вызвать колбек по завершение создания папок
        callback();
      })
    }
  ],(err)=>{
    if(err){
      base.sendMasage(err,res,0);
    }else{
      res.send({status: 'reg'});
    }
    
    
  })
}


module.exports = function(req, res){
	registration(req, res);
}