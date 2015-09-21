'use strict';
/**
 * Created by Bruce on 9/10/2015.
 */

 var path = require('path');
 var formidable = require('formidable');
 var config = require('./config').settings;
 var fs = require('fs');
 var utility = require('./utility');

module.exports = function (app) {

    //app.readConfig(__dirname, 'config.json');
    //that = this;

    //create new instance of router
    var router = require('express').Router();

    router.all('*', function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'height, width, mode, access-token');
      next();
    });

    var getToken = function(req){
        return req.params['token'];
    }

    var getServer = function(token) {
        return '';
    }

    var getAdapter = function(server) {
        return require('./qiniuAdapter.js');
    };

    //get file infomation by token
    router.get('/info/:token', function(req, res, next){
      // get the file info
      var fileToken = getToken(req);
      var fileAdapter = getAdapter(fileToken);

      try{
        fileAdapter.info(fileToken, function(err ,result){
          if(result){
            res.json(result);
            res.end();
          } else {
            res.json(err);
            res.end();
          }
        });
      }
      catch(err){
        res.end(err);
      }
    });

    //download a file by token
    router.get('/fs/:token', function(req, res, next){
      var fileToken = getToken(req);
      var fileAdapter = getAdapter(fileToken);
      var options = utility.selectKey(req.headers, 'height width mode');

      fileAdapter.download(fileToken, options, function(err, file){
        if (file) {
          res.json(file);
          res.end();
        } else {
          res.json(err);
          res.end();
        }
      });
    });

    //upload one or more files
    router.post("/fs", function(req, res, next){
      if(req.headers['content-type'].includes('multipart/form-data')) {
        // define
        var fileAdapter = getAdapter('');
        var options = {}, filesData = new Buffer(0);
        var form = new formidable.IncomingForm();
        // formidable settings
        form.uploadDir = config.flieCache;
        form.keepExtensions = true;

        try{
          // redefined form.onPart Function
          form.onPart = function(part) {
            form.handlePart(part);
            // binding get octData event, match the fileData
            part.addListener('data', function(chunk) {
              if(part.filename != undefined) {
                var temp = [];
                temp[0] = filesData;
                temp[1] = chunk;
                // match the files data
                filesData = Buffer.concat(temp);
              }
            });
          }

          // binding file upload finishing event
          form.on('file', function(name, file) {
            options['name'] = name;
            options['file'] = file;
            options['flieCache'] = config.flieCache;
            fileAdapter.upload(options, filesData, function(result){
              res.json(result);
              res.end();
            })
          });

          // parse the post form process the upload file
          form.parse(req, function(err, fields, files) {});
        }
        catch(err){
          res.end(err);
        }
      } else {

        var filesData = new Buffer(0);
        req.on('data', function(chunk){
          var temp = [];
          temp[0] = filesData;
          temp[1] = chunk;
          // match the files data
          filesData = Buffer.concat(temp);
        });

        req.on('end', function(){
          // define
          var fileAdapter = getAdapter(''), options = {};
          options['file'] = { type : req.headers['content-type'], size : req.headers['content-length'], name : req.headers['filename'] };
          fileAdapter.upload(options, filesData, function(result){
            res.json(result);
            res.end();
          })
        });
      }
    });


    //delete a file by token
    router.delete('/fs/:token', function(req, res, next){
      var fileToken = getToken(req);
      var fileAdapter = getAdapter(fileToken);

      fileAdapter.delete(fileToken, function(err, ret){
        res.json({ok:err?0:1});
      });
    });

    return router;
}
