'use strict';

let nodemailer = require('nodemailer');

function sendMail(email, title, text) {
  // Создаем транспорт, через который будем отправлять сообщения
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail.loftgallery@gmail.com',
      pass: 'rtlhjdrf',
    },
  });

// Определяем настройки письма
  var mailOptions = {
    from: 'Most friendly guys <mail.loftgallery@gmail.com>', // sender address
    to: email, // list of receivers
    subject: title, // Subject line
    html: text // html body
    //text: 'Hello from nodemailer!', // plaintext body
  };

// Отправляем сообщение
  transporter.sendMail(mailOptions, function(error, info){
    if (error)
      throw error;

    console.log('Message info: ', info.response);
    console.log('Full info: ', info);
  });
}


module.exports = sendMail;