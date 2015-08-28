/**
 * Created by Bruce on 5/15/2015.
 */
var Q = require('q');
var U = require('underscore');

module.exports = function (app) {

    var list = function(req, res, options){

        //get merged schema from data adapter by name
        var schema = require('../data/dbAdapter')(app).schema || {};

        //get entity definition in schema
        var entitySchemas = schema.entity || {};

        //get all entity names in dictionary by filter
        return U.filter(U.keys(entitySchemas), function(name){

            var entity = (entitySchemas)[name];

            var allowRest = (entity.rest == undefined) || entity.rest;

            //ignore show system entities flag
            if (options['showSys']){
                if (entity.sys && allowRest) return true;
            }

            //ignore show custom entities flag
            if (options['showCustom']){
                if (!entity.sys && allowRest) return true;
            }

            //ignore disable rest entities flag
            if (options['showRestDisabled']){
                if (!allowRest) return true;
            }

            //return true
            return false;
        })
    };

    var adapter = {

        //list all entities name
        listObjs: function (req, res) {

            var showSys = (req.query['showSys'] && req.query['showSys'] == 1) ? 1 : 0;
            var showCustom = (req.query['showCustom'] && req.query['showSys'] == 0) ? 0 : 1;
            var showRestDisabled = (req.query['showRestDisabled'] == undefined) ? 0 : (req.query['showRestDisabled'] == 1) ? 1 : 0;

            var options = {
                "showSys": showSys,
                "showCustom": showCustom,
                "showRestDisabled": showRestDisabled
            };

            //return promise
            return Q(list(req, res, options));
        },

        test: function(req, res) {

            return Q('Hello World!');
        },

        setup: function(req, res) {

            return Q('OK');
        },

        //return disable info for invalid method
        disable: function (req, res) {
            return Q("Disabled.");
        }
    };

    var that = adapter;

    return adapter;
};
