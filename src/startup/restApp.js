/**
 * Created by Bruce on 3/26/2015.
 */
module.exports = function (app, config) {

    //support parse JSON body that used rest methods,
    //comment these that we needn't use these now
    app.use(require('body-parser').json());

    //ignore request for favicon.ico
    app.use('/favicon.ico', function(req, res, next){
        return;
    });

    //loading security middle wares
    if (app.settings['supportMiddleware']){

        (config['middlewares'] || [])
            .filter(function(script){
                return (!(script == '' || script[0] == '#'));
            })
            .forEach(function(script){
                //load middleware script
                require(script)(app);
            });
    }

    var restRoute = require('../rest/routes/router')(app);

    app.use(app.get("useSubFolder")?'/rest':'/', restRoute);

    return app;
};
