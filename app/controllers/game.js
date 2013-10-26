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
    console.log(req.params.id);
    Game.findById(req.params.id, function(error, game) {
        request("http://namey.muffinlabs.com/name.json?count=1&with_surname=true", function(error, response, body) {
            if (_.find(game.players, function(p) {
                return p.user == req.params.id;
            })) return;
            game.players.push({
                user: req.body.id,
                pseudonym: JSON.parse(body)[0]
            });
            game.save();
            res.send(game);
        });
    });
};

