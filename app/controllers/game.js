var mongoose = require('mongoose'),
    Game = require('../models/game'),
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
        game.save(function(){res.json(game);});
    });

};

