let async = require('async');
let BaseModule = require('../modules/libs/_base.js');
let base = new BaseModule;
let sendMail = require('../modules/send-mail.js');
let User = require('./models/user.js').User;



// Восстановление пароля
let recover = function(req,res){
  var pass =  "" + base.passGenerate(8);

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
      // Обновляем пароль пользователя
      
      user.update({hashedpassword : user.encryptPassword(pass)},callback)
      console.log('Обновили данные')
    },
    function(user,callback){
      sendMail(req.body.email, 'Восстановление пароля', 'Новый пароль: ' + pass);
      callback();
    }

    ],(err)=>{
      // Если ошибка, отправляем клиенту сообщение с ошибкой
      if(err){
        base.sendMasage(err, res, 0);
      }else{
        // Если все хорошо, отправляем сообщение пользователю
        base.sendMasage('Сообщение отправленно', res , 1);
      }
  })

}





module.exports = function(req, res){
	recover(req, res);
}