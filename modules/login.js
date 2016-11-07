let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let User = require('./models/user.js').User;



// Регистрация пользователей
let login = function(req,res){
  async.waterfall([
    function(callback){
      // Ищем пользователя в базе по email
      User.findOne({'email': req.body.email},callback)
    },
    function(user,callback){
      // Проверка на существование пользователя
      if(user){
        callback(null,user);
      }else{
        callback('Такой пользователь не найден');
      }
    },
    function(user,callback){
      // Проверка на правильно пароля
      if(user.checkPassword(req.body.pass)){
        callback(null,user);
      }else{
        callback('Пароль не верный');
      }
    },
    function(user,callback){
      // Если прошли всю валидацию, записываем данные в сессию и идем дальше
      req.session.user_id = user.user_id;
      req.session.email = user.email;
      callback();
    }



    ],(err)=>{
      // Если ошибка, отправляем клиенту сообщение с ошибкой
      if(err){
        base.sendMasage(err, res, 0);
      }else{
        // Если все хорошо, отправляем ответ и перезагружаем страницу на /id*
        res.send({status: 'login'});
      }
  })

}


module.exports = function(req, res){
	login(req, res);
}