var mongoose = require('mongoose'),
    User = require('../models/user');

exports.id = function(req,res){
  User.findOne({username:req.params.username},function(error,user){
    res.send(user);
  });
};

exports.create = function(req,res){
  new User({username:req.body.username,defaultImage:req.body.defaultImage}).save();
  res.send({});
};
