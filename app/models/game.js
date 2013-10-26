
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var GameSchema = new Schema({
  name: String,
  geo: {type:[Number],index:'2d'},
  distance: Number,
  requiredUsers: Number,
  state: {type:String,default:"open"},
  players : [{user:Schema.Types.ObjectId,pseudonym:String}]
});

module.exports = mongoose.model('Game', GameSchema);
