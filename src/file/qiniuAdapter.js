'use strict';
var Q = require('q');
var qiniu = require('qiniu');
var qiniuConfig = require('./qiniuConfig').settings;

function QiniuAdapter(){
  //load config
  qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;
}

QiniuAdapter.prototype.info = function(hash, callback) {
  var result = {};
  try {
    var client = new qiniu.rs.Client();
    client.stat(qiniuConfig.bucketName, hash, function(err, ret) {
      if(!err){
        result = {
          'file-hash':ret.hash,
          'content-type': ret.mimeType,
          'putTime': ret.putTime,
          'size': ret.fsize
        }
        callback(null, result);
      } else {
        callback(err, null);
      }
    });
  } catch (err) {
    callback(err, null);
  }
}

QiniuAdapter.prototype.upload = function(options, buffer, callback) {
  // get the mask name of file
  var putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.bucketName);
  var maskName = options.file.path.replace(options.flieCache + 'upload_', ''), result = {};
  var extra = new qiniu.io.PutExtra();
  extra.mimeType = options.mimeType;
  // upload to qiniu
  qiniu.io.put(putPolicy.token(), null, buffer, extra, function(err, ret){
    if (!err) {
      result = {
        'file-hash':ret.hash,
        'file-name': options.file.name,
        'content-type': options.file.type,
        'size': options.file.size
      }
    } else {
      result = { 'error' : err };
    }
    callback(result);
  });
}

QiniuAdapter.prototype.download = function(hash, options, callback) {
  var self = this;
  self.info(hash, function(err, result){
    var baseUrl = qiniu.rs.makeBaseUrl(qiniuConfig.bucketUrl, result['file-hash']);
    var policy = new qiniu.rs.GetPolicy();
    if(self.optionsIsEmpty(options)){
      var iv = new qiniu.fop.ImageView();
      // settings of short view picture
      iv.mode = isNaN(+options.mode)? 0 : +options.mode;
      iv.width = isNaN(+options.width)? 0 : +options.width;
      iv.height = isNaN(+options.height)? 0 : +options.height;

      // create picture url
      baseUrl = iv.makeRequest(baseUrl);
    }
    result['file-url'] = policy.makeRequest(baseUrl);
    callback(result);
  });
}

QiniuAdapter.prototype.delete = function(hash, callback) {
  this.info(hash, function(err, result){
    if(result){
      var client = new qiniu.rs.Client();
      client.remove(qiniuConfig.bucketName, result['file-hash'], function(err, ret) {
        callback(err, ret);
      });
    } else {
      callback('not find file', result);
    }
  });
}

QiniuAdapter.prototype.optionsIsEmpty = function(options) {
  for (var prototype in options) {
    if (options.hasOwnProperty(prototype)) {
      return true;
    }
    return false;
  }
}

var adapter = new QiniuAdapter();

module.exports = adapter;
