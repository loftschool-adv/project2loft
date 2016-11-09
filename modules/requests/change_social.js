let async = require('async');
let User = require('../models/user.js').User;
let Social = require('../models/social.js').Social;
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;

// Добавлене альбомов
let changeSocial = function(req,res){
	let query = {};
	async.waterfall(
		[
			function(callback){
				console.log(req.body);
				
				query[req.body.name] = {name: req.body.title, link: req.body.link, title: req.body.name}
				console.log(query);


				Social.findOneAndUpdate({user_id : req.session.user_id},{
					$set : query
				},callback)
			},

		],
		(err)=>{
			if(err){
				throw err;
			}else{
				res.json(query);
			}
			
	})


}


module.exports = changeSocial;