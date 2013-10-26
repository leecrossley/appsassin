var mongoose = require('mongoose'),
  Picture = mongoose.model('Picture');

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
      // res.setHeader('Content-Length', picture.encoded.length()); 
      res.end(buf);
  });
};

exports.add = function(req, res){
  var picture = new Picture();
  picture.encoded = req.body.encoded;
  var id = picture.save();
  res.end(id);
};