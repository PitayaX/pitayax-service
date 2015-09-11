//require('babel/polyfill');
//require('babel/babel-core');
if (process.execArgv.indexOf('--harmony') < 0){
    console.log('babel');
    require('babel/register');
    require('./test2.js');
}
else {
    console.log('--harmony');
    require('child_process').fork('./test/test2.js');
}
