var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LocationSchema = new Schema({
  gameId: {type:Schema.Types.ObjectId,pseudonym:String, index: {unique: true}},
  userId: {type:Schema.Types.ObjectId,pseudonym:String, index: {unique: true}},
  loc: {type: [Number],index:'2d'},
  date: {type: Date, default: Date.now }
});

/*
TODO: 
userid, gameid, [lng, lat]
return [lng, lat] of target (most recent); 
gameid, userid */

module.exports = mongoose.model('Location', LocationSchema);