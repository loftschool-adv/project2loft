let async = require('async');
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let config = require('../../config.json');

let folder = config.folder.users;
let tmpFolder = config.folder.tmp;

// Добавлене альбомов
let clearTmp = function(req,res){

	base.clearFolder(`./${folder}/id${req.session.user_id}/${tmpFolder}/`,(err)=>{
		if(err){
			throw err;
		}else{
			res.json({});
		}
	});
	
}


module.exports = clearTmp;