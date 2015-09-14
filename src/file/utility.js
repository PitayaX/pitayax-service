var qiniu = require('qiniu');
var formidable = require('formidable');
var fileConfig = require('../startup/fileConfig').settings;

exports.selectKey = function (data, keyString) {
  try {
    var result = {};
    keyString = keyString.replace(/[ ]{2,}/g,' ').replace(/^[ ]|[ ]$/g,'');
    var keys = keyString.split(' ');
    keys.forEach(function(key){
      if(data[key] != undefined){
        if (data[key] != ''){
          result[key] = data[key];
        }
      }
    });
    return result;
  } catch (e) {
    console.log('Cannot select keys "' + keyString + '" form data, detial:' + e);
    return null;
  }
}
