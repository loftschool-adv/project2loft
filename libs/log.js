let winsote = require('winston');
let ENV = process.env.NODE_ENV;

// Количество элементов в пути
let lastElelemts = 2;

function getLogger (module) {
	let path = module.filename.split('\\').slice(-lastElelemts).join('/');
	console.log(path);
	return new winsote.Logger({
		transports : [
			new winsote.transports.Console({
				colorize: true,
				label : path
			})
		]
	});
}

module.exports = getLogger;