/**
 * Created by Bruce on 4/20/2015.
 */

module.exports =
    function(app) {
        return require('../data/dbAdapter')(app);
    };