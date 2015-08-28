/**
 * Created by Bruce on 4/9/2015.
 */
var fs = require('fs');
var path = require('path');
var U = require('underscore');

module.exports = function (app, entityName) {

    var dataAdapter = require('../data/dbAdapter')(app);
    if (!entityName) entityName = '';

    var adapter = {
        schema: dataAdapter.schema,

        allowCheck: function(req, res, methodName){

            //get role manager
            var roleMgr = require('../security/rbac')(app).role;

            //check control-allow for entity method.
            return roleMgr.allow(req.user, entityName, methodName, '');
        },

        model: function (req, res) {
            return that.retrieveModel(req, res);
        },

        retrieveModel: function (req, res) {
            return dataAdapter.retrieveModel(entityName);
        },

        get: function (req, res) {
            return that.retrieveOne(req, res);
        },

        retrieveOne: function (req, res) {

            //get filter by request
            var filter = that.getFilterByMask(req);

            //call retrieveOne by Q
            return dataAdapter.retrieveOne(entityName, filter);
        },

        list: function (req, res) {
            return that.retrieveList(req, res);
        },

        retrieveList: function (req, res) {

            return dataAdapter.retrieveList(entityName, that.parseFilter(req), that.parseOptions(req));
        },

        count: function (req, res) {
            return that.retrieveCount(req, res);
        },

        retrieveCount: function (req, res) {

            return dataAdapter.retrieveCount(entityName, that.parseFilter(req));
        },

        script: function (req, res) {
            return that.executeScript(req, res);
        },

        executeScript: function(req, res){
            var scriptName = req.params['name'] || '';

            //check report name is empty
            if (scriptName == '') {
                throw new Error('empty report name.')
            }

            //find report by defined path
            //var scriptPath = path.resolve('./rest/scripts/predefine/' + ((entityName == '') ? '' : (entityName + '/')) + scriptName + '.js');
            var scriptPath = '/predefine/' + ((entityName == '') ? '' : (entityName + '/')) + scriptName + '.js'

            //create instance of script engine
            var engine = require('../scripts/scriptEngine')();

            //parse predefine script by path
            var predefine = engine.parse(scriptPath);
            if (!predefine) throw new Error('invalid script name: ' + scriptName + '.');

            var args = {};
            var scriptArgs = predefine.arguments || {};

            //generate arguments default value for script
            for (var arg in scriptArgs){
                args[arg] = scriptArgs[arg].default;
            }

            //generate/overwrite arguments value by query parameters
            //it will override default value that defined in script
            for (var arg in req.query) {

                //get key defined in scripts
                var key = '$$' + arg;

                //override/create value for args from query
                args[key] = function(arg){

                    //get argument and it's type
                    var arg = (arg.indexOf(',') >= 0) ? arg.split(',') : arg;
                    var argType = (scriptArgs[key]) ? scriptArgs[key].type : 'string';

                    //convert it
                    return engine.convertArg(arg, argType);
                }(req.query[arg]);
            }

            //fill arguments in script
            var filter = engine.fillArgs(predefine.script, args);

            //get call method that defined in script
            var method = function(type) {

                switch(type){
                    case 'agg': case 'aggregate':
                        return 'aggregate';
                    default :
                        return 'find';
                }
            }(predefine.type);

            //generate result options
            var options = that.parseOptions(req);

            //append array of select fields to options
            if (filter['$fields']) options['fields'] = filter['$fields'];

            //invoke method to get result
            return dataAdapter.retrieveResult(entityName, method, filter, options);
        },

        aggregate: function (req, res) {
            return that.retrieveAggregate(req, res);
        },

        retrieveAggregate: function (req, res) {

            //return result by aggregate method for mongo-db
            return dataAdapter.retrieveAggregate(entityName, that.parseFilter(req), that.parseOptions(req));
        },

        insert: function (req, res) {
            return that.insertEntity(req, res);
        },

        insertEntity: function (req, res) {

            return dataAdapter.insertEntity(entityName, req.body);
        },

        update: function (req, res) {
            return that.updateEntity(req, res);
        },

        updateEntity: function (req, res) {

            //get filter and modifier by request
            var filter = that.getFilterByMask(req, req.body.query || {});
            var modifier = req.body.modifier || {};

            //call update model by Q
            return dataAdapter.updateEntity(entityName, filter, modifier);
        },

        delete: function (req, res) {
            return that.deleteEntity(req, res);
        },

        deleteEntity: function (req, res) {

            //get filter by request
            var filter = that.getFilterByMask(req, req.body);

            //call delete model by Q
            return dataAdapter.deleteEntity(entityName, filter);
        },

        getFilterByMask: function (req, query) {

            var findMask = {};

            if (query && U.size(query) > 0) {

                findMask = query;
            }
            else {

                var k = req.params['key'];
                var id = req.params['id'];

                if (!k && !id) return {};
                findMask[(k) ? k : '_id'] = id;
            }

            return findMask;
        },

        parseFilter: function (req) {
            if (req == null || !req.body) return {};

            var reqBody = dataAdapter.repackageEntity(req.body);
            return (reqBody['$query']) ? reqBody['$query'] : reqBody;
        },

        parseOptions: function (req) {

            var reqBody = (req == null || !req.body) ? {} : dataAdapter.repackageEntity(req.body);

            var options = {
                fields: (reqBody['$fields']) ? reqBody['$fields'] :((req.query.id) ? { "_id": 1 } : {}),
                sort: reqBody['$sort'] || {},
                page: reqBody['$page'] || 0,
                pageSize: reqBody['$pageSize'] || 0,
                other: {}
            };

            return options;
        }
    };

    var that = adapter;

    return adapter;
};
