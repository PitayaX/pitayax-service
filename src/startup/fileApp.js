/**
 * Created by Bruce on 3/26/2015.
 */

var qiniu = require('qiniu');
var formidable = require('formidable');
var fileConfig = require('./fileConfig').settings;
var fileUpload = require('../file/fileUpload');
var fs = require('fs');
var filesData = [], fileIndex = 0;

qiniu.conf.ACCESS_KEY = fileConfig.ACCESS_KEY;
qiniu.conf.SECRET_KEY = fileConfig.SECRET_KEY;

module.exports = function(app, config) {

  app.post('/upload', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = fileConfig.flieCache;
    form.keepExtensions = true;
    form.multiples = true;

    form.onPart = function(part) {
      // formidable原生处理函数
      form.handlePart(part);
      // 如果收到文件数据，添加监听器
      part.addListener('data', function(chunk) {
        if(filesData[fileIndex] == undefined){
          filesData[fileIndex] = chunk;
        } else {
          filesData[fileIndex] += chunk;
        }
      });
    }

    form.on('file', function(name, file) {
      // create qiniu policy
      var putPolicy = new qiniu.rs.PutPolicy(fileConfig.bucketName);
      var extra = new qiniu.io.PutExtra();
      // upload local file with qiniu
      qiniu.io.put(putPolicy.token(), file.name, filesData[fileIndex], extra, function(err, ret) {
        res.json(ret);
      });
      fileIndex++;
    });

    form.parse(req, function(err, fields, files) {});
  });

  app.post('/download', function(req, res, next) {

  });

  app.post('/delete', function(req, res, next) {

  });










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
            // create short view
            var url = fileUpload.shortView(keyName, fields.mode, fields.width, fields.height);
            // clear the cache
            fs.unlink(files.file.path);
            // return picture infomation
            ret['url'] = url;
            ret['filename'] = files.file.name;
            ret = [ret];
            res.json(ret);
          } else {
            res.json(err);
          }
        });
      } else {
        var result = [], uploadIndex = 0;
        // create qiniu policy
        var putPolicy = new qiniu.rs.PutPolicy(fileConfig.bucketName);
        var extra = new qiniu.io.PutExtra();
        for (var i = 0; i < files.file.length; i++) {
          // get file mask name
          files.file[i].key = files.file[i].path.replace(fileConfig.flieCache, '');
          qiniu.io.putFile(putPolicy.token(), files.file[i].key, files.file[i].path, extra, function(err, ret) {
            if(!err) {
              for (var i = 0; i < files.file.length; i++) {
                if(files.file[i].key == ret.key){
                  fs.unlink(files.file[i].path);
                  ret['filename'] = files.file[i].name;
                  ret['url'] = fileUpload.shortView(files.file[i].key, fields.mode, fields.width, fields.height);
                  result.push(ret);
                  uploadIndex++;
                }
              }
              if(uploadIndex == files.file.length){
                res.json(result);
              }
            } else {
              result.push({err:err});
              if(i == files.file[i].length - 1){
                res.json(result);
              }
            }
          });
        }
      }
    });
  });





  return app;
}
