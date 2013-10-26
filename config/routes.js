module.exports = function(app){

	var home = require('../app/controllers/home');
	app.get('/', home.index);

	var pictures = require('../app/controllers/pictures');
	app.post('/pictures/add', pictures.add);
	app.get('/pictures', pictures.index);
	app.get('/pictures/:id', pictures.show);

	var user = require('../app/controllers/user');
    app.post('/user',user.create);
    app.get('/user:id',user.id);

};
