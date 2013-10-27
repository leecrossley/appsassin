var mongoose = require('mongoose'),
    _ = require('underscore'),
    request = require('request'),
    Schema = mongoose.Schema;

var GameSchema = new Schema({
    name: String,
    geo: {
        type: [Number],
        index: '2d'
    },
    distance: Number,
    requiredPlayers: Number,
    state: {
        type: String,
        default: "open"
    },
    players: [{
      user: {type:Schema.Types.ObjectId,required:true},
        pseudonym: String
    }],
    missions: [{
        assassin: Schema.Types.ObjectId,
        victim: Schema.Types.ObjectId,
        time: {
            type: Date,
            default: Date.now
        },
        assassinName: String,
        victimName: String
    }],
    kills: [{
        assassin: Schema.Types.ObjectId,
        assassinName: String,
        victim: Schema.Types.ObjectId,
        victimName: String,
        time: {
            type: Date,
            default: Date.now
        }
    }]
});

GameSchema.methods.addPlayer = function(userid, continuation) {
    var game = this;
    request("http://namey.muffinlabs.com/name.json?count=1&with_surname=true", function(error, response, body) {
        if (game.requiredPlayers <= game.requiredPlayers.length) return;
        if (!(game.players.length !== 0 && _.find(game.players, function(p) {
            if(!p.user) return;
            return p.user.equals(userid);
        }))) {
            game.players.push({
                user: userid,
                pseudonym: JSON.parse(body)[0]
            });
            game.startIfFull();
        }
        game.save(continuation);
    });
};

GameSchema.methods.startIfFull = function() {
    if (this.requiredPlayers <= this.players.length) {
        console.log("Starting game " + this.name);
        this.state = "inprogress";
        var shuffle = _.shuffle(this.players);
        console.log(shuffle);
        for (var i = 0; i != shuffle.length; i++) {
            var nextPlayer = function() {
                    if (i + 1 === shuffle.length) return 0;
                    return i + 1;
                }();

            this.missions.push({
                assassin: shuffle[i].user,
                victim: shuffle[nextPlayer].user,
                assassinName: shuffle[i].pseudonym,
                victimName: shuffle[nextPlayer].pseudonym
            });
        }
    }
};

GameSchema.methods.poshEliminate = function(victim,picture,callback)
{

    var picture = createPictureTarget(picture);
    picture.save(function() {

        var url = generatePictureUrl(req.headers.host, picture.id);

        console.log("Trying to recognise player via url: " + url);

        var album = "appsassin2";
        var albumkey = "533e6074bc68a3e207f78b4ce6851a3b37e7466ffb34a9e8b60888d527707c70";


        request.post({
            url: 'https://lambda-face-recognition.p.mashape.com/recognize?album=' + album + "&albumkey=" + albumkey,
            headers: {
                "X-Mashape-Authorization": "zhSqQASs820A1uv3AdHO2ab2G3SUsA7D"
            },
            form: {
                "album": album,
                "albumkey": albumkey,
                "urls": url
            }
        }, function(error, response, body) {
            console.log(body);
            if (error) {
                console.log("there was an error sending picture for recog: " + response.body.error);
                // TODO: return matches ...
            }
            
        });
    });
}

GameSchema.methods.findVictim = function(userId) {
  console.log("Find victim for user: " + userId);
  return _.find(this.missions.reverse(), function(m) {
    return m.assassin.equals(userId);
  });
};

GameSchema.methods.findAssassin = function(userId) {
  console.log("Find assassin for user: " + userId);
  return _.find(this.missions.reverse(), function(m) {
    return m.victim.equals(userId);
  });
};


GameSchema.methods.eliminate = function(user) {
    console.log("eliminate " + user);
    var vm = _.find(this.missions.reverse(), function(m) {
        return m.victim.equals(user);
    });

    var am = _.find(this.missions.reverse(), function(m) {
        return m.assassin.equals(user);
    });


    if(!(am || vm))
      return;

    this.kills.push({
        assassin: user,
        assassinName: am.assassinName,
        victim: am.victim,
        victimName: am.victimName
    });

    if (!this.endGame()) {
        missions.push({
            assassin: user,
            assassinName: am.assassinName,
            victim: vm.victim,
            victimName: vm.victimName
        });
    }
}

GameSchema.methods.endGame = function() {
    if (this.kills.length === this.players.length - 1) {
        this.state = "complete";
        return true;
    }
    return false;
}

module.exports = mongoose.model('Game', GameSchema);

