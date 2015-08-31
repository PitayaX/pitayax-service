/**
 * Created by Bruce on 5/21/2015.
 */
/**
 * Created by Bruce on 1/22/2015.
 */

var fs = require('fs');
var U = require('underscore');

function getRestEntities(entities){
    return Object.keys(entities)
                .filter(function(name) {
                    var e = entities[name];
                    return (e.rest != undefined && e.rest === false) ? false : true;
                });

     /*U.filter(
        U.keys(entities),
        function(name){
            var e = entities[name];
            return (e.rest != undefined && e.rest === false) ? false : true;
        }
    );*/
}

module.exports = function(router, config) {

    //get instance of application
    var app = router.app;

    //get schemas for all entities
    var schemas = require('../data/schema')(app);

    //get entity names from schema
    var entityNames = getRestEntities((schemas && schemas.entity) ? schemas.entity : {});

    //fetch all entity name in array
    U.forEach(entityNames, function(entityName) {

        //create a router for current object
        var entityRouter = require('express').Router();
        var adapter = require('./entityAdapter')(app, entityName);

        //copy properties from router to entity router
        entityRouter.app = app;
        entityRouter.callback = router.callback;

        require('./restRouter')(entityRouter, config, adapter);

        router.use('/entity/' + entityName, entityRouter);
    });
};
