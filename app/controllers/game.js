var mongoose = require('mongoose'),
    Game = require('../models/game'),
    User = require('../models/user'),
    _ = require('underscore'),
    request = require('request');

exports.open = function(req, res) {
    Game.find({}, function(error, games) {
        res.json(games);
    });
};

exports.join = function(req, res) {
    Game.findById(req.params.id, function(error, game) {
        game.addPlayer(req.body.id, function() {
            res.json(game);
        });
    });
};

exports.eliminate = function(req, res) {
    Game.findById(req.params.id, function(error, game) {
        game.eliminate(req.body.id);
        game.save(function() {
            res.json(game);
        });
    });
};

exports.eliminatebyimage = function(req, res) {
    Game.findById(req.params.id, function(error, game) {
        game.poshEliminate(req.headers.host,req.body.user, req.body.picture, function(photo) {
            if (!photo) {
                res.json({
                    status: 'missed'
                });
            }
            var user = User.find().where('username').equals(photo.uids[0].prediction).exec(function() {
                game.eliminate(user._id);
            });

            res.json({
                status: 'hit',
                photo: photo
            });
        });
    });
};

