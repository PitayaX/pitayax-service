var fs = require('fs');
var Q = require('q');
var U = require('underscore')._;

module.exports = function (app, schema) {

    //check for arguments
    if (!app) throw new Error('can\'t initialize application.');
    if (!schema) throw new Error('Invalid schema');

    //create connections for current application
    var mongoConns = require('./mongoDBConnections')(app, schema);
    var converter = require('./entityConverter')(app);

    var adapter = {
        /* example code for find _data by Q for mongoose
         var deferred = Q.defer();

         //method1
         model.find(body, deferred.makeNodeResolver());

         //method2
         model.find(body,
         function(err, result) {
         if (err) deferred.reject(err);
         else deferred.resolve(result);
         });

         return deferred.promise;
         */

        schema: schema,

        model: function (entityName) {
            return this.retrieveModel(entityName);
        },

        retrieveModel: function (entityName) {

            var EntityModel = mongoConns.getModel(entityName);
            var entitySchema = new EntityModel().__schema;

            U.forEach(entitySchema, function (value, key) {

                //get function name
                var funName = value.toString();
                funName = funName.substr('function '.length);
                funName = funName.substr(0, funName.indexOf('('));

                switch (funName) {
                    case 'Date':
                        entitySchema[key] = '#MM/dd/yyyy#';
                        break;
                    case 'Boolean':
                        entitySchema[key] = false;
                        break;
                    case 'Number':
                        entitySchema[key] = 0;
                        break;
                    case 'String':
                        entitySchema[key] = '';
                        break;
                    default:
                        break;
                }
            });

            //return model schema and support to Q
            return Q(entitySchema);
        },

        get: function (entityName, filter) {
            return this.retrieveOne(entityName, filter);
        },
        retrieveOne: function (entityName, filter) {

            return this.retrieveResult(entityName, 'findOne', filter, {});
        },

        list: function (entityName, filter, options) {
            return this.retrieveList(entityName, filter, options);
        },
        retrieveList: function (entityName, filter, options) {

            return this.retrieveResult(entityName, 'find', filter, options);
        },

        count: function (entityName, filter) {
            return this.retrieveCount(entityName, filter);
        },

        retrieveCount: function (entityName, filter) {

            return this.retrieveResult(entityName, 'find', filter, { count: true });
        },

        aggregate: function (entityName, filter, options) {

            return this.retrieveAggregate(entityName, filter, options);
        },

        retrieveAggregate: function (entityName, filter, options) {

            //return result by aggregate method for mongo-db
            return this.retrieveResult(entityName, 'aggregate', filter, options);
        },

        retrieveResult: function (entityName, method, filter, options) {

            //parse options
            var count = (options && options.count) ? true : false;
            var fields = (options && options.fields) ? options.fields : {};
            var sort = (options && options.sort) ? options.sort : {};
            var page = (options && options.page) ? options.page : 0;
            var pageSize = (options && options.pageSize) ? options.pageSize : 0;

            return this.createDefer(entityName,(count) ? false : true, function (model, resolver) {

                if (method == 'aggregate'){
                    model.aggregate(filter, resolver);
                }
                else {

                    //only return count
                    if (count) {
                        //return total of result
                        model[method]
                            .call(model, filter)
                            .count()
                            .exec(resolver);
                    } else if (page == 0 && pageSize == 0) {

                        //return all result
                        model[method]
                            .call(model, filter, fields)
                            .sort(sort)
                            .exec(resolver);
                    } else {

                        //return result by page options
                        model[method]
                            .call(model, filter, fields)
                            .sort(sort)
                            .skip(pageSize * (page - 1))
                            .limit(pageSize)
                            .exec(resolver);
                    }
                }
            });
        },

        insert: function (entityName, modelBody) {
            return this.insertEntity(entityName, modelBody);
        },

        insertEntity: function (entityName, modelBody) {

            //get instance of model by name
            var Model = mongoConns.getModel(entityName);

            //create new model with body
            var newModel = new Model(modelBody);

            //get schema from instance of new model
            var modelSchema = newModel.__schema;

            //convert model properties by defined
            converter.convertModel(newModel, true);

            //get autoIncrement object
            var autoIncrement = (modelSchema.options && modelSchema.options.autoIncrement)
                ? modelSchema.options.autoIncrement
                : false;

            //define function for getting increment value
            var setAIValue = function (target, deferred, saveToMongo) {

                //exit function if current model doesn't support auto increment
                if (!autoIncrement) return;

                //get field for auto increment
                var aiField = (autoIncrement.field) ? autoIncrement.field : '';

                //check current model allow auto increment
                if (autoIncrement && !aiField) {
                    deferred.reject(new Error('empty field for auto-increment'));
                    return;
                }

                var queryMask = JSON.parse('{"$query": {}, "$orderby": {"{{fieldId}}": -1}}'.replace('{{fieldId}}', aiField));
                var projection = JSON.parse('{"{{fieldId}}": 1, "_id": 0}'.replace('{{fieldId}}', aiField));

                Model.findOne(queryMask, projection)
                    .exec(function (err, result) {

                    if (err) {

                        //catch error
                        deferred.reject(err);
                    } else {

                        //get variants for auto increment
                        var aiStart = (autoIncrement.startValue) ? autoIncrement.startValue : 0;
                        var aiStep = (autoIncrement.step) ? autoIncrement.step : 1;
                        var aiVal = (result) ? result[aiField] + aiStep : aiStart;

                        //set new value for target field
                        target[aiField] = aiVal;

                        //save changed model to mongo database
                        saveToMongo(target, deferred);
                    }
                });
            }; 

            //define function to save new model
            var saveToMongo = function (target, deferred) {

                target.save(
                    function (err, result) {

                        if (err) {

                            if (err.code == 11000 && autoIncrement)
                                setAIValue(target, deferred, saveToMongo);  //increase auto-inc
                            else deferred.reject(err);
                        } else {
                            //convert model result
                            converter.convertModel(result, false);

                            //accept result
                            deferred.resolve(result);
                        }
                    });
            };

            var deferred = Q.defer();

            saveToMongo(newModel, deferred);

            return deferred.promise;
        },

        update: function (entityName, filter, modifier) {
            return this.updateEntity(entityName, filter, modifier);
        },

        updateEntity: function (entityName, filter, modifier) {

            //check filter and modifier argument
            if (U.size(filter) == 0 || U.size(modifier) == 0) {
                throw new Error('Invalid update operation.');
            }

            return this.createDefer(entityName, true, function (model, resolver) {

                //convert model to
                converter.convertModel(model, true, U.keys(modifier));

                //update result by filter
                model.update(filter, modifier, resolver);
            });
        },

        delete: function (entityName, filter) {
            return this.deleteEntity(entityName, filter);
        },

        deleteEntity: function (entityName, filter) {
            //check filter argument
            if (U.size(filter) == 0) {
                throw new Error('Invalid delete operation.');
            }

            return this.createDefer(entityName, false, function (model, resolver) {
                //delete result by filter
                model.remove(filter, resolver);
            });
        },

        createDefer: function (entityName, convertResult, callback) {

            //get instance of model by name
            var model = mongoConns.getModel(entityName);

            //create instance of deferred
            var deferred = Q.defer();

            //callback(model, deferred.makeNodeResolver());

            callback(model,
                function (err, result) {

                    if (err) {

                        //reject promise if error occur
                        deferred.reject(err);
                    } else {

                        //convert result
                        if (convertResult) converter.convertList(result);

                        //resolve correct result
                        deferred.resolve(result);
                    }
                });

            //return interface of promise
            return deferred.promise;
        },

        repackageEntity: function (entity) {
            return JSON.parse(JSON.stringify(entity));
        }
    };

    var that = adapter;

    return adapter;
};
