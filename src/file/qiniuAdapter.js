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

QiniuAdapter.prototype.info = function(token) {

    var result = {
        "file-token":"xxxx", //you can use 7niu hash to repalce
        "file-name": "xxx.jpg",
        "content-type": "image/jpeg",
        "size": 412
    }

    //do something
    return Q(result);
}

QiniuAdapter.prototype.upload = function(options, buffer) {

  qiniu.io.put(this.putPolicy.token(), 'a.jpg', buffer, this.extra, function(err, ret){
    console.log(ret);
  });

  var result = {
      "file-token":"xxxx", //you can use 7niu hash to repalce
      "file-name": "xxx.jpg",
      "content-type": "image/jpeg",
      "size": 412
  }

  //do something
  return Q(result);
}

QiniuAdapter.prototype.download = function(token, options, res) {

    return 'test';
}

QiniuAdapter.prototype.delete = function(token) {

    var result = {
        "ok":1,
        "n":1
    }

    //do something
    return Q(result);
}

var adapter = new QiniuAdapter();

module.exports = adapter;
