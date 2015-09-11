var Q = require('q');
var fs = require('fs');
var File = require('./file');
function QiniuAdapter(){
    //load config

    //init
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
  // test for the file Data, the file is under project folder
  fs.appendFile(options.file.name, buffer, {encoding:'binary'});
  // test for the file Data with formidable file.js
  var file = new File({
    path: 'C:/upload/' + options.file.name,
    name: options.file.name
  });
  file.open();
  file.write(buffer, function() {});
  file.end(function() {});
  // test end
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
