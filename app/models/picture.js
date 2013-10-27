
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PictureSchema = new Schema({
  encoded: String,
  potentialTarget: {type:Boolean,default:false}
});

mongoose.model('Picture', PictureSchema);
