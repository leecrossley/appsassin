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
  Picture.findOne({id: req.params['pictureId']}, function(err, picture){
    if(err) throw new Error(err);
    if (!picture)
      return res.send('not found', 404);

    console.log(picture); 

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', picture.encoded.length());
    res.end(picture.encoded);
  });
};

exports.add = function(req, res){
  
  console.log(req.params)
  /*Picture.findOne({id: req.params['pictureId']}, function(err, picture){
    if(err) throw new Error(err);
    if (!picture)
      return res.send('not found', 404);

    console.log(picture); 

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', picture.encoded.length());
    res.end(picture.encoded);
  });*/
};