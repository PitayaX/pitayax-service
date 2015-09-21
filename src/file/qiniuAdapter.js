'use strict';
var Q = require('q');
var qiniu = require('qiniu');
var qiniuConfig = require('./qiniuConfig');
var http = require('http');

function QiniuAdapter(){

}

QiniuAdapter.prototype.info = function(serverHash, callback) {
  var self = this, result = {};
  // auto select the empty qiniu server
  self.getBucketByName(serverHash, function(hash, server){
    if(server == null){callback({ 'err' : 'The server number is not at server list.' });}
    try {
      // add the qinniu ACCESS_KEY and SECRET_KEY
      qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
      qiniu.conf.SECRET_KEY = server.SECRET_KEY;
      // get qiniu Client class
      var client = new qiniu.rs.Client();
      client.stat(server.bucketName, hash, function(err, ret) {
        if(!err){
          result = {
            'file-hash':ret.hash,
            'content-type': ret.mimeType,
            'putTime': ret.putTime,
            'size': ret.fsize
          }
          callback(null, result, server);
        } else {
          callback(err, null, server);
        }
      });
    } catch (err) {
      callback(err, null, server);
    }
  });
}

QiniuAdapter.prototype.upload = function(options, buffer, callback) {
  // auto select the empty qiniu server
  this.getEmptyBucket(function(server){
    if(server == null){callback('The server number is not at server list.');}
    // add the qinniu ACCESS_KEY and SECRET_KEY
    qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = server.SECRET_KEY;
    // create qiniu upload token
    var putPolicy = new qiniu.rs.PutPolicy(server.bucketName);
    var extra = new qiniu.io.PutExtra(), result = {};
    extra.mimeType = options.file.type;
    // upload to qiniu
    qiniu.io.put(putPolicy.token(), null, buffer, extra, function(err, ret){
      if (!err) {
        result = {
          'file-hash': server.name + ret.hash,
          'content-type': options.file.type,
          'size': options.file.size
        }
      } else {
        result = { 'error' : err };
      }
      callback(result);
    });
  });
}

QiniuAdapter.prototype.download = function(hash, options, callback) {
  var self = this;
  self.info(hash, function(err, result, server){
    if(server == null){callback('The server number is not at server list.');}
    // add the qinniu ACCESS_KEY and SECRET_KEY
    qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = server.SECRET_KEY;
    if(result != null){
      var baseUrl = qiniu.rs.makeBaseUrl(server.bucketUrl, result['file-hash']);
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
    } else {
      callback(null);
    }
  });
}

QiniuAdapter.prototype.delete = function(hash, callback) {
  this.info(hash, function(err, result, server){
    if(server == null){callback('The server number is not at server list.');}
    // add the qinniu ACCESS_KEY and SECRET_KEY
    qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = server.SECRET_KEY;
    if(result){
      var client = new qiniu.rs.Client();
      client.remove(server.bucketName, result['file-hash'], function(err, ret) {
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

QiniuAdapter.prototype.getEmptyBucket = function(callback){
  qiniuConfig.server.forEach(function(server){
    // 将来可能需要支持多七牛账号上传文件，自动切换空的七牛账号
    // qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    // qiniu.conf.SECRET_KEY = server.SECRET_KEY;
    // http.get("http://api.qiniu.com/stat/select/space?bucket=" + server.bucketName + "&from=%3Cstring%3E&to=%3Cstring%3E&p=%3Cstring%3E", function(res) {
    //   console.log("Got response: " + res.statusCode);
    // }).on('error', function(e) {
    //   console.log("Got error: " + e.message);
    // });
    if(server.name == 'qns001'){
      callback(server);
    }
  });
}

QiniuAdapter.prototype.getBucketByName = function(serverHash, callback){
  var serverName = serverHash.substring(0, 6), hash = serverHash.replace(serverName, '');
  for (var i = 0; i < qiniuConfig.server.length; i++) {
    if(qiniuConfig.server[i].name == serverName){
      callback(hash, qiniuConfig.server[i]);
      break;
    }
    if (i == qiniuConfig.server.length - 1) {
      callback(hash, null);
    }
  }
}

var adapter = new QiniuAdapter();

module.exports = adapter;
