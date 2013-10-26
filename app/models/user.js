var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  defaultImage : String
});

mongoose.model('User', UserSchema);
