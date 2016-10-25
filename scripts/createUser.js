// Данный скрип работает с базой описанной в moongoose.js
// Подключаем файл с моделью юзеров
let User = require('../models/user.js').User;

let user = new User({
    login : 'Tester',
    password: 'secret'
})

user.save(function( err, user, affected){
    if (err) throw err;
    //console.log(user);
    User.findOne({login: "Tester"}, (err, tester) => {
        console.log(tester.checkPassword("secret"));
    });
});

