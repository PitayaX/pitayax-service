/**
 * Created by Bruce on 3/30/2015.
 */
var defaultDatabaseName = 'default';

var mongoose = require('mongoose');
var U = require('underscore')._;

module.exports = function (app, schema) {

    var modelCache = {};

    var flagOfCacheModel = true;
    var defaultConnection = undefined;
    var connectionsCache = {};
    var connectionStringCache = {};

    var attachEvents = function (connectionString, connection) {

        if (!connection) {

            app.log.error('Create mongodb failed!');
            return;
        }

        //listen events
        connection.on('connected', function () {

            //connect successfully, append info to log
            app.record('Connection was created and connected, ' + connectionString);

            if (!connectionsCache[connectionString]['connected']) {
                connectionsCache[connectionString]['connected'] = true;
            }
        });

        connection.on('disconnected', function () {
            //connect successfully, append info to log
            app.record('Connection was closed, ' + connectionString);

            if (connectionsCache[connectionString]['connected']) {

                connectionsCache[connectionString]['connected'] = false;
            }
        });

        connection.on('open', function () {
            //connection opened, append info to log
            app.record('Opened connection: ' + connectionString);

        });

        connection.on('error', function (err) {
            if (err) {
                //Creating connection failed, append error message to log
                app.logger.error('Connect to database failed, ' + connectionString + '; details: ' + err.message);
            }
        });
    };

    //init
    (function () {
        //append logger
        app.record('init connections.');

        //fetch all database name defined in application
        U.forEach(
            U.uniq(U.keys(app.databases || {})),
            function (dbName) {

                //get connection string from application databases
                var connectionString = app.databases[dbName];

                //append database connection string to cache
                connectionStringCache[dbName] = connectionString;

                if (!connectionsCache[connectionString]) {

                    var options = {
                      db: { native_parser: true },
                      auth:{authdb:'admin'},
                      server:{poolSize:10}
                    }

                    //create connection by connection string
                    var connection = mongoose.createConnection(connectionString, options);

                    console.log(options);

                    //cached the connection
                    connectionsCache[connectionString] = { 'instance': connection, 'connected': false };

                    //attached evernts for current connection if it was created.
                    attachEvents(connectionString, connection);
                }

                //set default connection if the name equal default name
                if (!defaultConnection
                    && dbName == defaultDatabaseName) {
                    defaultConnection = connectionsCache[connectionString].instance;
                }
            }
            );

        //fetch all mapped name in collection
        U.forEach(
            schema.database || {},
            function (mappedName, dbName) {

                //mapped connection string to name
                if (connectionStringCache[mappedName]
                    && !connectionStringCache[dbName]) {

                    connectionStringCache[dbName] = connectionStringCache[mappedName];
                }
            }
            );
    })();

    return {
        getConnection: function (dbName) {

            if (defaultConnection
                && dbName === defaultDatabaseName) {

                return defaultConnection;
            }

            if (!connectionStringCache[dbName]) {
                throw new Error('Invalid database name:' + dbName);
            }

            //get connection string from cache
            var connectionString = connectionStringCache[dbName];

            if (!connectionsCache[connectionString]) {
                throw new Error('Invalid connection string:' + connectionString);
            }

            return connectionsCache[connectionString].instance;
        },

        getModelSchema: function (entityName) {
            var entities = schema.entity || {};

            var entity = entities[entityName];

            return (entity && entity.model) ? entity.model : undefined;
        },

        getModelConverter: function (entityName) {
            var entities = schema.entity || {};

            var entity = entities[entityName];

            return (entity && entity.model) ? entity.converter : undefined;
        },

        getMongoSchema: function (entityName) {

            var entities = schema.entity || {};

            var entity = entities[entityName];

            if (entity && entity.model) {

                return mongoose.Schema(entity.model, entity.options || {});
            }
            else throw new Error('Invaild name for entity, ' + entityName);
        },

        getModel: function (entityName) {

            //get instance model from cache
            var model = modelCache[entityName];
            if (model) return model;

            model = this.createModel(entityName);

            //cache current model if flag was turn on
            if (model && flagOfCacheModel) {
                modelCache[entityName] = model;
            }

            //return instance of model
            return model;
        },

        getDatabase: function (entityName) {

            var database = ((schema.entity || {})[entityName] || {})['database'];
            return database;
        },

        getNameFromEntity: function (entity) {

            if (entity.__name)
                return entity.__name;

            throw new Error('Invalid entity:' + entity);
        },

        getSchemaFromEntity: function (entity) {

            if (entity.__schema)
                return entity.__schema;

            throw new Error('Invalid entity:' + entity.__name);
        },

        createModel: function (entityName) {

            //get schema from defined file
            var mongoSchema = this.getMongoSchema(entityName);

            //get database name for current entity
            var dbName = this.getDatabase(entityName) || defaultDatabaseName;

            //get connection by database name
            var modelConnection = this.getConnection(dbName);

            if (!modelConnection) {
                throw new Error('get connection failed for db-name:' + dbName);
            }

            //get all model names from current connection
            var modelNames = modelConnection.modelNames();

            //create model by name and schema
            var model
                = modelConnection.model(
                    entityName,
                    (modelNames.indexOf(entityName) >= 0) ? undefined : mongoSchema
                    );

            if (model) {

                //append system properties.
                model.prototype.__name = entityName;
                model.prototype.__schema = this.getModelSchema(entityName) || {};
                model.prototype.__converter = this.getModelConverter(entityName) || {};
            }

            return model;
        }
    };
};
