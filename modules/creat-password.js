'use strict';
let crypto = require('crypto');

function createPassword(user) {
  let pass =  Math.floor(Math.random() * (999999 - 1)) + 1;
  let salt = Math.random() + '';
  user.update({salt : '1234'}, function(item){
    console.log(item)
  });
  //let hashedpassword = pass;
  //let test = crypto.createHmac('sha1', salt).digest('hex');

  console.log(user.encryptPassword(pass));
  //console.log(test);
}


module.exports = createPassword;