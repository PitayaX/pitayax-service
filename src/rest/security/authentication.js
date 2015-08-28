/**
 * Created by bruce on 8/13/14.
 */
var crypto = require('crypto');
var fs = require('fs');

var Q = require('q');
var U = require('underscore')._;

var config = JSON.parse(
    fs.readFileSync(__dirname + '/config.json',
        { encoding: 'utf-8' }));
        
if (!config.password) { config.password = {}; }
if (!config.token) { config.token = {}; }

function hashString(hashs, hashed) {

    if (!hashed) { return ''; }

    if (!hashs) { hashs = [{ hash: 'md5', digest: 'base64' }]; }

    U.forEach(hashs, function (item) {

        var hash = crypto.createHash(item.hash || 'md5');

        hash.update(hashed);
        hashed = hash.digest(item.digest || 'base64');
    });

    return hashed;
}

module.exports = function (app) {

    var password = {
        encrypted: function (password) {

            return hashString(config.password.hashs, password);
        },

        decrypted: function (password) {

            //return password mask
            return '********';
        },

        next: function (low, high) {

            return Math.random() * (high - low + 1) + low;
        },

        equal: function (user, password) {

            //get password of login user.
            password = this.encrypted(password);

            //verify user password
            return (password == user.password);
        }
    };

    var token = {
        generate: function (user) {

            //var now = session.currentTime();
            var now = new Date();

            var padZero = function (value, length) {

                if (!length) length = 2; value = String(value);

                for (var i = 0; i < length; i++) {
                    value = '0' + value;
                }
                return value.substr(value.length - length, length);
            };

            //generate token by 'HHYYYYssMMddmm' for current time
            var timeToken
                = padZero(now.getHours())
                + padZero(now.getFullYear(), 4)
                + padZero(now.getSeconds())
                + padZero(now.getMonth() + 1)
                + padZero(now.getDate())
                + padZero(now.getMinutes());

            //moment().utc().format('HHYYYYssMMddmm')
            var mask = 'K*' + user.account + '*' + timeToken + '*' + user.salt + '*';

            return hashString(config.token.hashs, mask);
        }
    };

    var session = {
        cacheName: '$session',
        defaultExpireSeconds: config.token.expires || 3000,

        timeOutError: function () {
            return new Error('Invalid session');
        },

        currentTime: function () {
            return new Date();
        },

        insert: function (user) {
            return {
                "account": user.account,
                "token": token.generate(user),
                "lastLoginDate": this.currentTime()
            };
        },

        check: function (session) {
            if (!session
                || !session.lastLoginDate) {
                throw new Error('Invalid session or api Key!');
            }

            var diffTime = (this.currentTime().getTime() - session.lastLoginDate.getTime()) / 1000;

            return (diffTime <= this.defaultExpireSeconds);
        },

        getByToken: function (token) {
            var deferred = Q.defer();

            if (!token) deferred.resolve(null);
            else {
                //get all roles and permission from database or config file.
                require('./dbAdapter')(app)
                    .get('session', { 'token': token })
                    .then(function (session) {
                    deferred.resolve(session);
                })
                    .catch(function (err) {
                    deferred.reject(err);
                });
            }

            return deferred.promise;
        }
    };

    return {
        password: password,
        token: token,
        session: session
    };
};

var M = module.exports;
