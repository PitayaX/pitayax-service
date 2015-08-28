/* global process */
/**
 * Created by Bruce on 1/22/2015.
 */
module.exports = function (app) {

    app.use(function(req, res, next) {

      console.log('path:' + req.path);

      next();
    });
}
