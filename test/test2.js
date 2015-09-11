"use strict";
//import path from 'path';
//import fs from 'fs';
//import {ConfigMap} from './util/conf';
require('./util/runtime');
let path = require('path');
let fs = require('fs');
//require('./util/conf.js');
let ConfigMap = require('./util/conf.js').ConfigMap;
console.log('hm:' + harmonyMode);
//let ConfigMap = conf.ConfigMap;

//console.log(IIf(2===2, 1, 2));

function* f(){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    return;
}

for(let i of f()){
    console.log('yield:' + i);
}

let debugConfigMap = true;
//debugConfigMap = false;
if (debugConfigMap){

    //get full file path for configuration
    let configFile = path.join(__dirname, 'config.json');
    //callee

    //parse config json to an object
    let config = ConfigMap.parseJSON(fs.readFileSync(configFile, { encoding: 'utf-8' }));

    //let a = ConfigMap.parse({"a1":1, "a2":2});
    let a = new ConfigMap();
    a.copy(config.get('databases'));

    console.log ('json a:' + a.toJSON());

    console.log ('version:' + config.Version);

    console.log ('json config:' + config.toJSON(true));

    for(let k of config.keys()){
        let v = config[k];
        //console.log(`k:${k}, v:${JSON.stringify(v)}`);
    }
}
