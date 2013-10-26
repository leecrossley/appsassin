

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PictureSchema = new Schema({
  encoded: String
});

mongoose.model('Picture', PictureSchema);
