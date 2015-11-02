/**
 * Created by bruce on 8/13/14.
 */
//require('../../rest/security/authentication');
var U = require('underscore')._;

module.exports = function (app) {

    var authentication = require('../security/authentication')(app);

    var methodAdapter = {
        encryptPwd: function (model, key) {

            model[key] = authentication.password.encrypted(model[key]);
        },

        decryptPwd: function (model, key) {

            model[key] = authentication.password.decrypted(model[key]);
        },

        fillSlat: function (model, key) {

            model[key] = parseInt(authentication.password.next(10000000, 99999999));
        }
    };

    return {
        convertModel: function (entity, flag, limits) {
            //get database schema for current model
            var modelConverter = entity.__converter;

            //exit function if there is no converter interface defined.
            if (!modelConverter) { return; }

            //fetch all converter defined in current model
            U.forEach(modelConverter,
                function (methods, property) {
                    //execute current convert
                    if (limits && !limits.contains(property)) return;

                    //get handle method for current converter.
                    var methodName = (flag) ? methods.method : methods.method2;

                    //call method if the name isn't empty
                    if (methodName && methodAdapter[methodName]) {
                        methodAdapter[methodName](entity, property);
                    }
                }
                );
        },

        convertList: function (models) {

            //exit if models is undefined
            if (!models) return;

            //convert item to array if models is single object
            if (!(models instanceof Array)) models = [models];

            var that = this;

            //fetch all model in list
            U.forEach(models, function (model) {


                //convert database value to show value
                //for properties of current model
                that.convertModel(model, false);

                //console.log('model2:'+JSON.stringify(model, null, 4))
            });
        }
    };
};