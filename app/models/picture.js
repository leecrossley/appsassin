

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PictureSchema = new Schema({
  encoded: String,
  potentialTarget: Boolean
});

mongoose.model('Picture', PictureSchema);
