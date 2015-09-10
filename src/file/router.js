'use strict';
/**
 * Created by Bruce on 9/10/2015.
 */

var path = require('path');

module.exports = function (app) {

    //that = this;

    //create new instance of router
    var router = require('express').Router();

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

        var fileToken = getToken(req);
        var fileAdapter = getAdapter(fileToken);

        try{
            fileAdapter
                .info(fileToken)
                .then(function(data) {
                    res.json(data);
                    res.end();
                })
                .catch(function(err) {
                    res.end('err');
                });
        }
        catch(err){
            res.end('err2');
        }
        //res.end(fileToken);
    });

    //download a file by token
    router.get('/:token', function(req, res, next){

        var ft = getToken(req);

        res.end(ft);
    });

    //upload one or more files
    router.post("/", function(req, res, next){
        //
    });

    //delete a file by token
    router.delete('/:token', function(req, res, next){
        var ft = getToken(req);

        res.end(ft);
    });

    return router;
}
