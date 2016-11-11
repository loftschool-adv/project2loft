// мидл перенаправляет get запрос на главную страницу
let middleware = function(req,res){
 res.redirect(`/id${req.session.user_id}/`);
}


module.exports = function(req, res){
	middleware(req, res);
}