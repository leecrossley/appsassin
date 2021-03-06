var express = require('express'),
    restify = require('express-restify-mongoose'),
    mongoose = require('mongoose');

var pictures = require('../app/controllers/pictures');

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    restify.serve(app,mongoose.model('User'), { postProcess: pictures.newuser });
    restify.serve(app,mongoose.model('Game'));
    restify.serve(app,mongoose.model('Location'));
    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};
