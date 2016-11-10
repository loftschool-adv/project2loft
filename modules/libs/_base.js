let fs = require('fs');
let async = require('async');
let del = require('del');

function Base(){

  // Функция проверяет на наличие папки (Ассинхронно)
  this.checkDirectory = function(dir,callback){
    fs.stat(dir, function(err,stats){
      if (err && err.errno === 34) {
        fs.mkdir(dir, callback);
      } else {
      callback(err)
    }

    })
  }

  // Отправляет ответ серверу в виде сообщение и статуса
  this.sendMasage = function (message, res, status = 0) {
  res.json(
    {
      message: message,
      status: status
    })
  };

  


  // Генератор папки. Если папки нет, то создает ее
  this.folderGenerator = function(folder,callback){
    fs.stat(folder, function(err,stats){
      if(!stats){
        fs.mkdir(folder,(err) =>{
          if(err) throw err;
          callback();
        })
      }else{
        callback();
      }
    })
  }


  this.clearFolder = function(folder,callback){
    let thisModule = this;
    async.series(
    [
      function(callback_2){

        thisModule.folderGenerator(folder,callback_2);
      },
      function(callback_2){
        del([folder + '/**/*']).then(() =>{
          callback_2();
        })
        
      }
        
    ],
    (err)=>{
      if(err) throw err;
      callback();
    })
  }

  // Генерация пароля
  this.passGenerate = function(len){
    var ints =[0,1,2,3,4,5,6,7,8,9]; 
    var chars=['a','b','c','d','e','f','g','h','j','k','l','m','n','o','p','r','s','t','u','v','w','x','y','z'];
    var out='';
    for(var i=0;i<len;i++){
      var ch=Math.random(1,2);
      if(ch<0.5){
        var ch2=Math.ceil(Math.random(1,ints.length)*10);
        out+=ints[ch2];
      }else{
        var ch2=Math.ceil(Math.random(1,chars.length)*10);
        out+=chars[ch2];            
      }
    }
    return out.toUpperCase();
  }

  // Поиск по базе
  this.findDB = function(model,callback,find={}){
    model.find(find,callback)
  }
  this.findOneDB = function(model,callback,find={}){
    model.find(find,callback)
  }
} 

module.exports = Base;