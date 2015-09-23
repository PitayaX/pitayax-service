var crypto = require('crypto');
var formidable = require('formidable');
var fileConfig = require('../startup/fileConfig').settings;

var key="PitayaX-BruceKey";


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

exports.encrypt = function(token){
  var cipher = crypto.createCipher('aes-256-cbc', key);
  var crypted =cipher.update(token, 'utf8', 'base64');
  crypted+=cipher.final('base64');
  return crypted.replace(/\//g, '*').replace(/\=/g, '_').replace(/\+/g, '-');
}

exports.decrypt = function(encrypted){
  encrypted = encrypted.replace(/\*/g, '/').replace(/_/g, '=').replace(/-/g, '+');
  var decipher = crypto.createDecipher('aes-256-cbc', key);
  var dec = decipher.update(encrypted,'base64','utf8');
  dec += decipher.final('utf8');
  return dec;
}
