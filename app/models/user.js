var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  defaultImage : String
});


module.exports = mongoose.model('User', UserSchema);
