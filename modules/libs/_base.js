let fs = require('fs');

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