var Q = require('q');

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

QiniuAdapter.prototype.download = function(token, options, res) {

    return 'test';
}

var adapter = new QiniuAdapter();

module.exports = adapter;
