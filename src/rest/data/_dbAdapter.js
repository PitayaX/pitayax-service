var fs = require('fs');

module.exports = function (app, schema) {

    if (!app) app = (global) ? global.app : null;

    if (!schema) {
        schema = require('./schema')(app);
    }
    else if (typeof(schema) === 'string') {
        schema = require('./schema')(app, schema);
    }

    return require('./mongoDBAdapter')(app, schema);
};
