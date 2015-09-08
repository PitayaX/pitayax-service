import es6 from 'babel-runtime/core-js';

global.Map = es6.Map;

global.IIf = (express, r1, r2) => {
    return (express) ? r1 : r2;
}

export default es6;
