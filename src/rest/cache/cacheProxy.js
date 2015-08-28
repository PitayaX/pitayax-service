/**
 * Created by Bruce on 1/8/2015.
 * demo proxy class, test
 */
var U = require('underscore');
var caches = {};

var proxy = {

    //default value of  cache item timeout
    defaultTimeout: 3000,

    put: function (key, item, expiredSeconds) {

        if (!expiredSeconds) expiredSeconds = this.defaultTimeout;

        //create new dict for cache if it wasn't created
        if (!module.caches) { module.caches = {}; }

        //put cache item to dict
        module.caches[key] = { data: item, created: new Date(), expired: expiredSeconds };
    },

    get: function (key) {
        try {
            var cacheItem = module.caches[key];
            if (!cacheItem || this.isExpired(cacheItem)) return null;

            return module.caches[key].data;
        }
        catch (err) {
            return null;
        }
    },

    isExpired: function (item) {
        return false;
    }
};

module.cache = this.cache;
module.exports = proxy;
