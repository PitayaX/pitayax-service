// writen by roger, at 09/28/2015
var fs = require('fs');
var crypto = require('crypto');
var EventEmitter = require('events').EventEmitter;

function eHandle() {
  this.hash = crypto.createHash('md5').update(eHandle.caller.toString()).digest('base64');
  this.events = new EventEmitter();
  this.logLevel = 1;
  this.logOutput = 'fileServer.log';
  return this;
}

exports.eHandle = eHandle;

eHandle.prototype.throw = function(event, message) {
  this.events.emit(this.hash + event, message);
}

eHandle.prototype.catch = function(event, callback) {
  this.events.on(this.hash + event, callback);
}
/***************************************************************************************************************************************************************/
function tracer() {
  this.logLevel = 9;
  this.logOutput = 'fileServer.log';
  this.logStream = fs.createWriteStream(this.logOutput, { 'flags' : 'a' });
  this.levelError = 0;
  this.levelWarn = 1;
  this.levelInfo = 2;
  this.levelVerbose = 3;
  return this;
}

exports.tracer = new tracer();

tracer.prototype.verbose = function(message) {
  var self = this;
  try {
    if(self.logLevel > self.levelVerbose){
      self.write(self.levelVerbose, message);
    }
  } catch (e) {
    console.log(e);
  }
}

tracer.prototype.info = function(message) {
  var self = this;
  try {
    if(self.logLevel > self.levelInfo){
      self.write(self.levelInfo, message);
    }
  } catch (e) {
    console.log(e);
  }
}

tracer.prototype.warn = function(message) {
  var self = this;
  try {
    if(self.logLevel > self.levelWarn){
      self.write(self.levelWarn, message);
    }
  } catch (e) {
    console.log(e);
  }
}

tracer.prototype.error = function(message) {
  var self = this;
  try {
    if(self.logLevel > self.levelError){
      self.write(self.levelError, message);
    }
  } catch (e) {
    console.log(e);
  }
}

tracer.prototype.write = function(logLevel, message) {
  var self = this;
  try {
    var flag = '[Verbose]';
    switch (logLevel) {
      case self.levelError: flag = '[Error]'; break;
      case self.levelWarn: flag = '[Warn]'; break;
      case self.levelInfo: flag = '[Info]'; break;
      default:  flag = '[Verbose]';
    }
    message = flag + new Date(Date.now()).toISOString() + ':' + message + '\r\n';
    self.logStream.write(message);
  } catch (e) {
    console.log(e);
  }
}
