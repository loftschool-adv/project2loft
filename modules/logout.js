// Выход пользователя
let logout = function(req,res){
  if (req.body.req == 'logout') {
    req.session.destroy();
    res.send({status: 'logout'});
  }
}


module.exports = function(req, res){
	logout(req, res);
}