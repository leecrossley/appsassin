var mongoose = require('mongoose'),
  Picture = mongoose.model('Picture'),
  User = mongoose.model('User'),
  unirest = require('unirest');

var createPicture = function(encoded) {
  var picture = new Picture();
  picture.encoded = encoded;
  return picture;
};

var learn = function(username, url) {

  console.log("Posting to album_train, " + username);

  var album = "appsassindefault";
  var albumkey = "ed742659aa2cedd19b075cfbd683d5e64a795fa50d867784e51ec60e82f44eb8";

  unirest.post('https://lambda-face-recognition.p.mashape.com/album_train')
    .headers({
      "X-Mashape-Authorization": "zhSqQASs820A1uv3AdHO2ab2G3SUsA7D" })
    .field("album", album)
    .field("albumkey", albumkey)
    .field("entryid", username)
    .field("urls", url)
    .end(function (response) {
      console.log(response.body);
      if (response.body.error){
        console.log("there was an error sending picture for recog: " + response.body.error);
      }
    });
};

exports.index = function(req, res){
  Picture.find(function(err, pictures){
    if(err) throw new Error(err);
    res.render('pictures/index', {
      title: 'Pictures',
      pictures: pictures
    });
  });
};

exports.show = function(req, res){
  var query = Picture.find({_id: req.params['id']});

  query.findOne(function (err, picture) {
      if(err) throw new Error(err);
      console.log(picture.encoded);
      if (!picture)
        return res.send('not found', 404);
      var b64string = picture.encoded;
      var buf = new Buffer(b64string, 'base64');
      res.setHeader('Content-Type', 'image/jpeg');
      res.end(buf);
  });
};

exports.add = function(req, res){
  var picture = createPicture(req.body.encoded);
  picture.save();
  res.end(picture);
};

exports.newuser = function(req, res){

  console.log("Adding new picture for new user...");

  var query = User.find({ username: req.body.username });
  query.findOne(function (err, user) {
      if(err) throw new Error(err);
      
      var picture = createPicture(req.body.defaultImage);
      picture.save();

      user.defaultImage = picture.id;
      user.save();

      learn(user.username, req.headers.host + "/pictures/" + picture.id);
  });
};

