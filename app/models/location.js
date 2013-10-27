var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LocationSchema = new Schema({
  gameId: {type:Schema.Types.ObjectId,pseudonym:String},
  userId: {type:Schema.Types.ObjectId,pseudonym:String},
  loc: {type: [Number],index:'2d'},
  date: {type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);