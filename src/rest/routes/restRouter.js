/**
 * Created by Bruce on 5/15/2015.
 */
/**
 * Created by Bruce on 1/22/2015.
 */
var Q = require('q');
var U = require('underscore');

module.exports = function (router, config, adapter) {

    //get instance of application from router
    var app = router.app || {};

    //get handles from config file.
    var handles = (config.route) ? config.route : {};

    //get callback from router
    var callback = router.callback;

    //create instance of security router
    var restRouter = require('express').Router();
    var restAdapter = (adapter) ? adapter : require('./' + config['adapter'])(app);

    //fetch all method in handles file
    Object.keys(handles)
        .forEach(function(httpMethod) {
            var handle = handles[httpMethod];

            //fetch all paths in current http method
            handles[httpMethod].forEach(function (item) {

                //get route path from item
                var routePath = item.key;

                //set route for http method and route path
                restRouter[httpMethod](routePath, function (req, res) {

                    try {
                        //get rest name for method
                        var restMethod = item.value;
                        if (!restMethod) {
                            //The router doesn't support empty rest method
                            throw new Error('The router doesn\'t support empty rest method.');
                        }

                        //get the method in adapter by rest name
                        var adapterMethod = restAdapter[restMethod];
                        if (!adapterMethod) {
                            //The router can't find rest method in adapter
                            throw new Error('Current router doesn\'t support the rest method: ' + restMethod + '.');
                        }

                        if (!config.anonymous) {

                            //control access for current method by rest route
                            var allowCheck =
                                (restAdapter.allowCheck == undefined)
                                    ? function(req, res, adapterMethod) { return true; }
                                    : restAdapter.allowCheck;

                            if (!allowCheck(req, res, restMethod)) {

                                throw new Error("Deny access this method.");
                            }
                        }

                        //invoke rest method
                        adapterMethod(req, res)
                            .then(function (data) {

                                //get result successfully, return data
                                callback(req, res, null, data);
                            })
                            .catch(function (err) {
                                //get result failed, return error
                                callback(req, res, err, null);
                            });
                    }
                    catch (err) {

                        //catch unknown issue, return error
                        callback(req, res, err, null);
                    }
                });
            });
        });

    var path = (config['path']) ? config['path']:'/'

    console.log('p1:' + path)

    //add rest method to router
    router.use(path, restRouter);
};
