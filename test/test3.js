"use strict";

//import path from 'path';

//var path = require('path');

let tm = require('./tmodule');
//import ('path');

function* f() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    return;
}

let cf = new ConfigMap();
cf.set('a', 1).set('b', 2);
console.log('b: ' + cf.get('b'));

console.log(tm.test());
//tm.test();

console.log('start');

for(let i of f()) {
    console.log('yield: ' + i)
}

console.log('end');
