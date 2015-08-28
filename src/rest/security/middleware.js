/* global process */
/**
 * Created by Bruce on 1/22/2015.
 */
module.exports = function (app) {

    var rbac = require('./rbac')(app);
    var auth = require('./authentication')(app);

    var isIgnore = function (req) {

        if (req.url
            && req.url.indexOf('/security/') != -1) {

            return true;
        }

        return false;
    };

    //load all roles to cache
    var loadRole = function (req, res, next) {

        console.log(req.url)

        if (isIgnore(req)) { next(); return; }

        if (rbac.role.loaded) {

            //record message
            app.record('roles were loaded');

            //continue if roles were loaded
            next();
        }
        else {

            process.nextTick(function () {

                //record message
                app.record('loading roles.');

                //invoke to load all roles
                rbac.role.load()
                    .then(function (data) {

                    app.record('loaded roles: ' + JSON.stringify(data));

                    next();
                })
                    .catch(function (err) {
                    app.catchError(req, res, err);
                });
            });
        }
    };

    var loadToken = function (req, res, next) {

        if (isIgnore(req)) { next(); return; }

        //get token from headers or params
        var token = req.header('token') || req.params['token'] || req.params['t'];
        req.token = (token) ? token : undefined;

        //record message
        if (req.token)
            app.record('Got token: "' + token + '" from request');
        else app.record('Can\'t parse token from request');

        next();
    };

    var loadSession = function (req, res, next) {

        if (isIgnore(req)) { next(); return; }

        //read token from request
        if (!req.token) {
            next();
            return;
        }

        auth.session.getByToken(req.token)
            .then(function (session) {

            //record message
            app.record('Created session ' + JSON.stringify(session) + ' by token.');

            //verify token from database and check it is expired or not
            var isAuthorized = false;

            if (session) {
                isAuthorized = auth.session.check(session) ? true : false;
            }

            //bind session to request
            req.session = (isAuthorized) ? session : undefined;

            //record message
            if (req.session)
                app.record('Session was authorized');
            else app.record('Session wasn\'t created or released.')

            //process next middle ware
            next();
        })
            .catch(function (err) {
            app.logger.error('failed for getting session, details:' + err.message);

            app.catchError(req, res, err);
        });
    };

    var loadUser = function (req, res, next) {

        if (isIgnore(req)) { next(); return; }

        //declare
        var userMgr = rbac.user;

        //get process user function
        ((req.token && req.session)
            ? userMgr.loadUser(req.token)
            : userMgr.loadDefaultUser())
            .then(function (user) {

            //bind user to request.
            req.user = (user) ? user : undefined;

            if (req.user)
                app.record('Got user: ' + JSON.stringify(req.user));
            else app.record('Can\'t get user from request');

            //process next middle ware
            next();
        })
            .catch(function (err) {
            app.catchError(req, res, err);
        });
    }

    app.use(
        loadRole,
        loadToken,
        loadSession,
        loadUser);
};;