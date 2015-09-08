/**
 * Created by Bruce on 3/26/2015.
 */

var qiniu = require('qiniu');
var fileConfig = require('./fileConfig');
var formidable = require('formidable');
var fileConfig = require('./fileConfig').settings;
var fs = require('fs');

qiniu.conf.ACCESS_KEY = fileConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = fileConfig.SECRET_KEY;

var selectKey = function (data, keyString) {
  var result = {};
  keyString = keyString.replace(/[ ]{2,}/g,' ').replace(/^[ ]|[ ]$/g,'');
  var keys = keyString.split(' ');
  for (var i = 0; i < keys.length; i++) {
    if (data[keys[i]] == undefined){
      console.log('data.' + keys[i] + 'is undefined.');
      return null;
    }
    if (data[keys[i]] != '')
      result[keys[i]] = data[keys[i]];
    else
      return null;
  }
  return result;
}

var postParse = function(post){
  var data = {};
  post = post.split('&');
  for (var i = 0; i < post.length; i++) {
    data[post[i].split('=')[0]] = post[i].split('=')[1];
  }
  return data;
}

module.exports = function(app, config) {

  app.post('/picture/upload', function(req, res, next) {
    // create a new instance of formidable
    var form = new formidable.IncomingForm();
    // settings of formidable
    form.uploadDir = fileConfig.flieCache;
    form.keepExtensions = true;
    form.multiples = true;

    // process of formidable upload
    form.parse(req, function(err, fields, files) {

      // single file upload
      if(files.file.length == undefined){

        // create qiniu policy
        var putPolicy = new qiniu.rs.PutPolicy(fileConfig.bucketName);
        var extra = new qiniu.io.PutExtra();

        // upload local file with qiniu
        var keyName = files.file.path.replace(fileConfig.flieCache, '');
        qiniu.io.putFile(putPolicy.token(), keyName, files.file.path, extra, function(err, ret) {
          if(!err) {
            // return the short view of upload picture
            var url = qiniu.rs.makeBaseUrl(fileConfig.bucketUrl, keyName);
            var iv = new qiniu.fop.ImageView();

            // settings of short view picture
            iv.width = isNaN(+fields.width)? 500 : +fields.width;

            // create picture url
            url = iv.makeRequest(url);
            var policy = new qiniu.rs.GetPolicy();
            url = policy.makeRequest(url);

            // clear the cache
            fs.unlink(files.file.path);

            // return picture infomation
            ret['url'] = url;
            res.json(ret);
          } else {
            res.json(err);
          }
        });
      } else {
        // for (var i = 0; i < files.file.length; i++) {
        //   var bucketName = 'test';
        //   var putPolicy = new qiniu.rs.PutPolicy(bucketName);
        //   putPolicy.expires = 3600;
        //   var extra = new qiniu.io.PutExtra();
        //
        //   qiniu.io.putFile(putPolicy.token(), files.file[i].name, files.file[i].path, extra, function(err, ret) {
        //
        //   });
        // }
      }

    });
  });

  return app;
}
