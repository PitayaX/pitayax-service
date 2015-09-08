var qiniu = require('qiniu');
var formidable = require('formidable');
var fileConfig = require('../../startup/fileConfig').settings;

exports.shortView = function(keyName, mode, width, height){
  // return the short view of upload picture
  var url = qiniu.rs.makeBaseUrl(fileConfig.bucketUrl, keyName);
  var iv = new qiniu.fop.ImageView();

  // settings of short view picture
  iv.mode = isNaN(+mode)? 0 : +mode;
  iv.width = isNaN(+width)? 0 : +width;
  iv.height = isNaN(+height)? 0 : +height;

  // create picture url
  url = iv.makeRequest(url);
  var policy = new qiniu.rs.GetPolicy();
  url = policy.makeRequest(url);

  return url;
}
