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
} 

module.exports = Base;