// В зависимости от сессии отображаем пользователю главную страницу или страницу авторизаии
let indexRender = function(req,res){
  if (!req.session.email) {
    res.render('index');
  } else {
    res.redirect(`/id${req.session.user_id}/`);
  }
}


module.exports = function(req, res){
  indexRender(req, res);
}