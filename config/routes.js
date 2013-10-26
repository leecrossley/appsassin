module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);

	var pictures = require('../app/controllers/pictures');
	app.post('/pictures/add', pictures.add);
	app.get('/pictures', pictures.index);
	app.get('/pictures/:pictureId', pictures.show);


};
