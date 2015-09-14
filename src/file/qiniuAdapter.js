'use strict';
var Q = require('q');
var qiniu = require('qiniu');
var qiniuConfig = require('./qiniuConfig').settings;

function QiniuAdapter(){
  //load config
  qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY;
  qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;
  //init
  this.putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.bucketName);
  this.extra = new qiniu.io.PutExtra();
}

QiniuAdapter.prototype.info = function(hash, callback) {
  var result = {};
  try {
    // get all the infomation of files, qiniu hasn't API to search file with hash
    qiniu.rsf.listPrefix(qiniuConfig.bucketName, null, null, null, function(err, ret) {
      if(err) throw 'QiniuAdapter.info error, detial:' + err;
      // search all file, if the file hash is the same as req.hash, get it
      ret.items.forEach(function(fileInfo){
        if(fileInfo['hash'] == hash){
          result = {
            'file-hash':fileInfo.hash,
            'mask-name': fileInfo.key,
            'content-type': fileInfo.mimeType,
            'putTime':fileInfo.putTime,
            'size': fileInfo.fsize
          }
          // send the result
          callback(result);
        }
      });
    });
  } catch (e) {
    console.log(err);
    callback(result);
  }
}

QiniuAdapter.prototype.upload = function(options, buffer, callback) {
  // get the mask name of file
  var maskName = options.file.path.replace(options.flieCache, ''), result = {};
  // upload to qiniu
  qiniu.io.put(this.putPolicy.token(), maskName, buffer, this.extra, function(err, ret){
    if (!err) {
      result = {
        'file-hash':ret.hash,
        'file-name': options.file.name,
        'mask-name': maskName,
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
  this.info(hash, function(result){
    var baseUrl = qiniu.rs.makeBaseUrl(qiniuConfig.bucketUrl, result['mask-name']);
    var policy = new qiniu.rs.GetPolicy();
    if(options != null){
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
  this.info(hash, function(result){
    var client = new qiniu.rs.Client();
    client.remove(qiniuConfig.bucketName, result['mask-name'], function(err, ret) {
      callback(err, ret);
    });
  });
}

var adapter = new QiniuAdapter();

module.exports = adapter;
