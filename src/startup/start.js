/**
 * Created by Bruce on 3/26/2015.
 * Edit by Bruce on 5/7/2015
 * Edit by Bruce on 8/26/2015
 */
var fs = require('fs');
var path = require('path');

var readConfig = function(codebase, configFile) {
    // check for arguments
    if (codebase === undefined) codebase = __dirname;
    if (configFile === undefined) configFile = 'config.json';

    //read settings from configuration file
    return JSON.parse(
        fs.readFileSync(path.join(codebase, configFile),
            { encoding: 'utf-8' })
    );
};

// get configuration in config.json
var config = readConfig();

//initialize global
initApp(global, config);

var servers = config['servers'] || []

var serverList = {};

//for each every server defined in configuration file
servers.forEach(function(server){
    createServer(server['config'] || '', server['script']);
});

//start every server that was created,
//if the many server use same port, we will see these are as one server share the port.
Object.keys(serverList)
    .forEach(function(port){
        startServer(serverList[port]);
    });

function initApp(app, config) {

    if (app == undefined) return;
    if (!app.config) app.config = config;

    //set application name
    app.appName = (config.name) ? config.name : 'unknown';

    //set read configuration file function
    app.readConfig = readConfig;

    //put settings from configuration file to application
    if ((typeof(app.set) === 'function')){
        Object.keys(config.settings || {})
            .forEach(function(k){
                //ignore comment key
                if (k[0] == '#') return;
                app.set(k, config.settings[k] || '');
            });
    }

    //put variants in local from configuration file to application
    if (app.locals) {
        Object.keys(config.locals || {})
            .forEach(function(k){
                //ignore comment key
                if (k[0] == '#') return;
                app.locals[k] = config.locals[k] || '';
            });
    }

    //merge global and application databases
    var merge = function(dic1, dic2){
        Object.keys(dic2)
            .forEach(function(key){
                dic1[key] = dic2[key];
            })
        return dic1;
    }

    var databases= {}; app.databases ={};
    if (global && global['databases']) merge(databases, global['databases']);
    if (config['databases']) merge(databases, config['databases']);

    Object.keys(databases)
        .filter(function(name){
            return !(name.indexOf('#') == 0);
        })
        .forEach(function(name){
            app.databases[name] = databases[name] || '';
        });

    //create logger if need
    app.logger = function(app){
            if (typeof(app.logger) == 'Object') return app.logger;
            else{
                //define output stream for logger
                var output = (!config.output || config.output === 'stdout')
                    ? process.stdout
                    : fs.createWriteStream(path.join(process.cwd(), config.output), { flags: 'a+' });

                //define error stream for logger
                var error = (!config.error || config.error === 'stderr')
                    ? process.stderr
                    : fs.createWriteStream(path.join(process.cwd(), config.error), { flags: 'a+' });

                //create new instance of logger
                return new console.Console(output, error);
            }
        }(app);

    app.record = function (message) {

        if (app.settings
            && app.settings['recordSteps']) {
            app.logger.log(message);
        }
    };

    //return instance of application
    return app;
};

function createServer(configFile, appFile){

    var serverConfig = JSON.parse(fs.readFileSync(path.join(__dirname, configFile), { encoding: 'utf-8' })) || {};
    if (!serverConfig.settings) serverConfig.settings = {};

    var port = serverConfig.settings.port || process.env.port;
    var serverApp = serverList[port] ? serverList[port] : null;

    var newApp = require(appFile)(initApp((serverApp)?serverApp:require('express')(), serverConfig), serverConfig);

    if (!serverList[port])serverList[port] = newApp;

    return newApp;
};

function startServer(app) {

    var server = app.listen(
        app.get('port') || process.env.port,
        function () {
            app.logger.log('Express server (' + app.appName + ') listening on port ' + server.address().port);
        }
    );
};
