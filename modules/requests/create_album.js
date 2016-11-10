let async = require('async');
let Album = require('../models/album.js').Album;
let Image = require('../models/image.js').Image;
let BaseModule = require('../libs/_base.js');
let base = new BaseModule;
let config = require('../../config.json');
let translit = require('translit-be2ascii');
let slug = require('slug');
let path = require('path');
let Jimp = require('jimp');


let addAlbum = function(req,res){
	
	async.waterfall(
		[
			function(callback){
				console.log(req.body);
			}
		],
	(err)=>{
		if(err){
			throw err
		}else{
			res.json({'Получай ответ'})
		}

	})
}


module.exports = addAlbum;