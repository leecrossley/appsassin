var mongoose = require('mongoose'),
    Location = require('../models/location'),
    User = require('../models/user'),
    Config = require('../../config/config'),
    Game = require('../models/game'),
    unirest = require('unirest'),
    smslock = require('../../smslock');

var sendSms = function(message, phoneNumber) {
  console.log("Send Sms to user: " + message);

  if (smslock.recentlySent(phoneNumber)) {
    console.log("Avoiding spamming SMS service");
    return;
  }

  smslock.add(phoneNumber);

  phoneNumber = (phoneNumber.charAt(0) === "0") ? 
    phoneNumber.replace("0", "44") : phoneNumber;
  
  var key = "343319f73c3abbbef5b7f1b8277d853a473b55a3";

  url = "https://api.clockworksms.com/http/send.aspx?key=" + key + "&to=" + phoneNumber + "&content=" + encodeURIComponent(message);
  console.log(url);
  unirest.get(url).end(function(response){
    console.log(response);
  });
};

if (typeof Number.prototype.toRad == 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var nearTo = function(lon1, lat1, lon2, lat2) {
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad();
  var lat1 = lat1.toRad();
  var lat2 = lat2.toRad();

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d/1000; // distance in m
};

exports.track = function(req, res) {

  var gameId = req.body.gameId;
  var userId = req.body.userId;
  var lng = req.body.lng;
  var lat = req.body.lat;

  User = mongoose.model('User');

  new Location({
    gameId: gameId,
    userId: userId,
    loc: [lng, lat]
  }).save(function(err, location){
    if (err)
      console.log(err);
      // console.log(location);
  });

  Game.findById(gameId, function(err, game){

    if (!game) {
      throw new Error("no game found with id " + gameId);
    }

    var target = game.findVictim(userId);
    if (!target)
      throw new Error("No target found for user " + userId);
    var targetId = target.victim;
    console.log("targetId is " + targetId);

    var assassin = game.findAssassin(userId);
    if (!assassin)
      throw new Error("No assassin found for user " + userId);
    var assassinId = assassin.assassin;
    console.log("assassinId is " + assassinId);

    Location.findOne({ 
        gameId: gameId, 
        userId: targetId
      })
      .sort({date: -1})
      .exec(function(err, location){
        console.log("Get location of target ..." + location);
        if (location) {

          if (nearTo(location.loc[0], 
            location.loc[1], lng, lat)) {

            console.log("Promity alert fired for target " + targetId + 
              " assassin " + assassinId);

            // !!! this needs to happen once in a period ...
            User.findById(targetId, function(err, user) {
              sendSms("Your assassin is within 100m of your location!!!", user.username);
            });

            User.findById(assassinId, function(err, user) {
              sendSms("You are within 100m of your victim!!!", user.username);  
            });
            
            
          }

          res.json(location.loc);
        }
        res.end();
      });

  })
};