/**
 * Created by Bruce on 1/22/2015.
 */
var path = require('path');

module.exports = function (app) {

    //create new instance of router
    var router = require('express').Router();

    //read settings from configuration file
    var config = app.readConfig(__dirname);

    //set application to router
    router.app = app;

    //define call back function
    router.callback = function (req, res, err, result) {

        //set headers to response for rest settings
        var settings = config.settings || {};
        var restSettings = app.get('rest') || {};

        res.setHeader("Access-Control-Allow-Origin", restSettings.crosDomain || "*");   //allow cross domain to access REST services
        res.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "3628800");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");

        if (req.token) {
            res.setHeader('token', req.token);
            res.setHeader("ETag", req.token);
        }

        var outputJSON = function (result) {

            var pretty = (settings.json || {}).pretty;

            if (pretty) {
                res.write(JSON.stringify(result, null, 4));
                res.end();
            }
            else res.json(result);
        };

        //output JSON for error node
        if (err) {
            //append error to logger
            app.logger.error('Got error, details:' + err.message);

            outputJSON({ "error": { "code": err.code, "message": err.message } });
        } else {
            //output JSON for result
            outputJSON(result);
        }
    };

    ///literate all keys in configuration file
    Object.keys(config)
          .forEach(function(key) {

            //get router configuation file by key
            var routerConfig = config[key];

            //check it whither or not is router config
            if (routerConfig && routerConfig['route']) {

                //append router to current router.
                require((routerConfig['router'])?routerConfig['router']:'./restRouter')(router, routerConfig || {});
                app.logger.log('rest server for ' + key + ' is ready');
            }
          })

    //append test rest method for root path
    router.get(
        '/',
        function (req, res, next) {
            router.callback(req, res, null, 'REST');
        }
    );

    //append not support methods for undefined paths
    router.get(
        '*',
        function (req, res, next) {
            router.callback(req, res, null, 'Not support');
        }
    );

    return router;
};
