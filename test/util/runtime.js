'use strict';

global.harmonyMode = (process.execArgv.indexOf('--harmony') >= 0) ? true :false

if (harmonyMode) {
    console.log('harmony mode');
    module.exports = {};
}
else {
    console.log('babel mode');
    //import es6 from 'babel-runtime/core-js';
    var es6 = require('babel-runtime/core-js').default;

    //export default es6;
    global.Map = es6.Map;
    module.exports = es6;
}

global.IIf = (express, r1, r2) => {
    return (express) ? r1 : r2;
}
