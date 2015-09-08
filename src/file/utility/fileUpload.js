var qiniu = require('qiniu');
var formidable = require('formidable');
var fileConfig = require('../../startup/fileConfig').settings;

exports.shortView = function(keyName, width){
  // return the short view of upload picture
  var url = qiniu.rs.makeBaseUrl(fileConfig.bucketUrl, keyName);
  var iv = new qiniu.fop.ImageView();

  // settings of short view picture
  iv.width = isNaN(+width)? 0 : +width;

  // create picture url
  url = iv.makeRequest(url);
  var policy = new qiniu.rs.GetPolicy();
  url = policy.makeRequest(url);

  return url;
}
