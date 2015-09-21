'use strict';
var Q = require('q');
var qiniu = require('qiniu');
var qiniuConfig = require('./qiniuConfig');
var http = require('http');
var utility = require('./utility');

function QiniuAdapter(){

}

QiniuAdapter.prototype.info = function(fileToken, callback) {
  var self = this, result = {}, file = {};
  // try to decrypt the file token
  try {
    file = JSON.parse(utility.decrypt(fileToken));
  } catch (e) {
    callback({ error : 'The file token is invailed, detial: Decrypt the file token failed.' });
    return;
  }
  // get the bucket server infomation
  var server = self.getBucketByName(file.bucketName);
  if (!server) { callback({ error : 'The file token is invailed, detial: The server number is not correct.' }); return; }

  // get the file infomation from bucket server
  try {
    // add the qinniu ACCESS_KEY and SECRET_KEY
    qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = server.SECRET_KEY;

    // get qiniu Client class
    var client = new qiniu.rs.Client();
    client.stat(server.bucketName, fileToken + file.name, function(err, ret) {
      if(!err){
        result = {
          'file-hash' : ret.hash,
          'file-token' : fileToken,
          'file-name' : file.name,
          'content-type': ret.mimeType,
          'putTime': ret.putTime,
          'size': ret.fsize
        }
        callback(null, result, server);
      } else {
        callback(err, null, server);
      }
    });
  } catch (e) {
    callback({ error : 'Search file info failed, detial: ' + e.toString() });
  }
}

QiniuAdapter.prototype.upload = function(options, buffer, callback) {
  // auto select the empty qiniu server
  this.getEmptyBucket(function(server){
    if(server == null){callback('All servers bucket are full.');}
    // add the qinniu ACCESS_KEY and SECRET_KEY
    qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = server.SECRET_KEY;
    // create qiniu upload token
    var putPolicy = new qiniu.rs.PutPolicy(server.bucketName), extra = new qiniu.io.PutExtra(), result = {};
    var fileInfo = { bucketName : server.name, name : options.file.name, timeStamp : Date.now() }, fileToken = utility.encrypt(JSON.stringify(fileInfo));
    extra.mimeType = options.file.type;
    // upload file to qiniu
    qiniu.io.put(putPolicy.token(), fileToken + options.file.name, buffer, extra, function(err, ret){
      if (!err) {
        result = {
          'file-hash': ret.hash,
          'file-token': fileToken,
          'file-name': options.file.name,
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

QiniuAdapter.prototype.download = function(fileToken, options, callback) {
  var self = this;
  try {
    self.info(fileToken, function(err, result, server){
      if(err) { callback(err); return;}
      // add the qinniu ACCESS_KEY and SECRET_KEY
      qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
      qiniu.conf.SECRET_KEY = server.SECRET_KEY;

      // generate the download url
      if(result != null){
        var baseUrl = qiniu.rs.makeBaseUrl(server.bucketUrl, result['file-token'] + result['file-name']);
        var policy = new qiniu.rs.GetPolicy();
        // if there are any other about picture process
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
        callback(null, result);
      } else {
        callback('Generate download url failed, detial: Cannot find the file in bucket.', null);
      }
    });
  } catch (e) {
    callback('Generate download url failed, detial: ' + e.toString(), null);
  }
}

QiniuAdapter.prototype.delete = function(hash, callback) {
  var self = this;
  try {
    self.info(hash, function(err, result, server){
      if(err) { callback(err); return;}
      // add the qinniu ACCESS_KEY and SECRET_KEY
      qiniu.conf.ACCESS_KEY = server.ACCESS_KEY;
      qiniu.conf.SECRET_KEY = server.SECRET_KEY;
      if(result){
        var client = new qiniu.rs.Client();
        client.remove(server.bucketName, result['file-token'] + result['file-name'], function(err, ret) {
          callback(err, ret);
        });
      } else {
        callback('not find file', result);
      }
    });
  } catch (e) {
    callback('Delete file failed, detial: ' + e.toString(), null);
  }
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

QiniuAdapter.prototype.getBucketByName = function(bucketName, callback){
  for (var i = 0; i < qiniuConfig.server.length; i++) {
    if(qiniuConfig.server[i].name == bucketName){
      return qiniuConfig.server[i];
      break;
    }
    if (i == qiniuConfig.server.length - 1) {
      return null;
    }
  }
}

var adapter = new QiniuAdapter();

module.exports = adapter;
