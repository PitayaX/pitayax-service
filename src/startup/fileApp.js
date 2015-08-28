/**
 * Created by Bruce on 3/26/2015.
 */
module.exports = function(app, config) {

  app.use('/', function(req, res, next) {
    
    res.end('file server')});

  return app;
}
