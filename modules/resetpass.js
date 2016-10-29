'use strict';

let nodemailer = require('nodemailer');


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
  to: 'gboyur@gmail.com', // list of receivers
  subject: 'Message', // Subject line
  text: 'Hello from nodemailer!', // plaintext body
  html: '<b>Hello from nodemailer!</b>' // html body
};

// Отправляем сообщение
transporter.sendMail(mailOptions, function(error, info){
  if (error)
    throw error;

  console.log('Message info: ', info.response);
  console.log('Full info: ', info);
});

module.exports = nodemailer;