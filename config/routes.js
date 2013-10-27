module.exports = function(app){

  var home = require('../app/controllers/home');
  app.get('/', home.index);

  var pictures = require('../app/controllers/pictures');
  app.post('/recognise',pictures.recognise);
  app.post('/pictures/add', pictures.add);
  app.get('/pictures', pictures.index);
  app.get('/pictures/:id', pictures.show);

  var user = require('../app/controllers/user');
  app.post('/user',user.create);
  app.get('/user:id',user.id);

  var game = require('../app/controllers/game');
  app.get('/api/v1/opengames',game.open);
  app.post('/api/v1/joingame/:id',game.join);
  app.post('/api/v1/eliminate/:id',game.eliminate);
  app.post('/shoot/:id',game.eliminatebyimage);

  var location = require('../app/controllers/location');
  app.post('/api/v1/location/track', location.track)
};
