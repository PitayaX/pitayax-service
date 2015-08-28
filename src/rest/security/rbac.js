/**
 * Created by Bruce on 11/21/2014.
 */
require('q');
require('underscore');
require('../cache/cacheProxy');

var Q = require('q');
var U = require('underscore');

module.exports = function(app){

    var cache = require('../cache/cacheProxy');

    var role = {
        cacheName: '$role',
        roleNameOfEveryOne: 'everyone',
        denyException: new Error('Access denied.'),

        load: function(){

            var that = this;
            var deferred = Q.defer();

            //get all defined roles from cache
            var roles = cache.get(this.cacheName);

            //next if the roles were cached.
            if (roles){
                deferred.resolve(1);
            }
            else{
                //get all roles from database if it wasn't cached.
                this.getAll()
                    .then(function(data){

                        //cache all roles
                        cache.put(that.cacheName, data, 3000);

                        that["loaded"] = true;

                        deferred.resolve(1);
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
            }

            return deferred.promise;
        },

        getAll: function(){


            var roles = {};                 //create empty collection for all roles

            var deferred = Q.defer();

            require('./dbAdapter')(app)
                .list('role', '', {})    //get all roles from store media
                .then(function(data){

                    //create array of retrieve permission function
                    var retrieveArray
                        = U.map(
                        data,   //array of all roles
                        function(role){

                            //return function for getting permissions by role name
                            return require('./dbAdapter')(app)
                                .list('permission', {role: role.name}, {})
                                .then(function(data){

                                    //set permission for current role
                                    roles[role.name] = (data)?data:[];
                                });
                        });

                    return Q.all(retrieveArray);
                })
                .then(function(){

                    //app.record('roles:' + JSON.stringify(roles, null, 4));

                    //return all roles
                    deferred.resolve(roles);
                })
                .catch(function(err){
                    deferred.reject(err);
                });

            return deferred.promise;
        },

        getPermissions: function(roleName){

            //get all defined roles from cache
            var roles = cache.get(this.cacheName);

            if (roles && roles[roleName])
                return roles[roleName];
            else return [];
        },

        getPermissionsByUser: function(user, entity, operation, scripts){

            var that = this;
            var permissions = [];

            U.forEach(user.roles, function(roleName){

                var permissionsByRole = that.getPermissions(roleName);

                if (entity) {

                    //filter permission by entity
                    permissionsByRole = U.filter(permissionsByRole, function(permission){

                        //match all permissions with entity name or wide char
                        return (permission.entity == '*' || permission.entity == entity);
                    });

                    if (operation) {

                        //filter permission by operation
                        permissionsByRole = U.filter(permissionsByRole, function(permission){

                            //matched operation
                            if (permission.operation == '*'
                                || permission.operation == operation){

                                if (scripts){

                                }

                                return true;
                            }
                            else {
                                //split operation to match
                            }

                            return false;
                        });
                    }
                }

                permissions = U.union(permissions, permissionsByRole);
            });

            return permissions;
        },

        allow: function(user, entity, operation, scripts){

            if (!user || !user.roles) return false;

            var permissions = this.getPermissionsByUser(user, entity, operation, scripts);

            if (!permissions || permissions.length == 0) return false;
            app.record('permissions:' + JSON.stringify(permissions));

            //re-sort permissions
            var permission = U.first(permissions);

            //return the first permission
            return permission.allow;
        }
    };

    var user = {
        cacheName: '$user',
        defaultUserAccount: 'guest',
        defaultUser: undefined,

        loadUser: function(token){

            var that = this;
            var deferred = Q.defer();

            //try to get user from cache
            var userCacheName = this.cacheName + '_' + token;
            var user = cache.get(userCacheName);

            if (user){
                deferred.resolve(user);
            }
            else {
                this.loadDefaultUser()
                    .then(function(){
                        that.getByToken(token)
                            .then(function(data){

                                if (data){
                                    user = data;
                                    that.packageRoles(user);
                                    cache.put(userCacheName, user, 5000);
                                }
                                else user = this.defauleUser;

                                deferred.resolve(user);
                            })
                            .catch(function(err){
                                deferred.reject(err);
                            });
                    })
                    .catch(function(err){
                        deferred.reject(err);
                    });
            }

            return deferred.promise;
        },

        loadDefaultUser: function(){
            var that = this;
            var deferred = Q.defer();

            if (this.defaultUser){
                deferred.resolve(this.defaultUser);
            }
            else {
                //try to get user from cache
                var userCacheName = this.cacheName + '_' + this.defauleUserAccount;
                var user = cache.get(userCacheName);

                if (user){
                    deferred.resolve(user);
                }
                else {
                    this.getById(this.defaultUserAccount)
                        .then(function(user){
                            that.defaultUser = user;

                            if (that.defaultUser){
                                that.packageRoles(user);
                                cache.put(userCacheName, user, 30000);
                            }

                            deferred.resolve(user);
                        })
                        .catch(function(err){
                            deferred.reject(err);
                        })
                }
            }

            return deferred.promise;
        },

        getById: function(account){

            var deferred = Q.defer();

            //get all roles and permission from database or config file.
            require('./dbAdapter')(app)
                .get('user', {'account': account})
                .then(function(user) {

                    user = require('./dbAdapter')(app)
                            .repackageEntity(user);
                    deferred.resolve(user);
                })
                .catch(function(err) {deferred.reject(err);});

            return deferred.promise;
        },

        getByToken: function(token){
            var that = this;
            var deferred = Q.defer();

            //get all roles and permission from database or config file.
            require('./dbAdapter')(app)
                .get('session', {'token': token})
                .then(function(session){

                    if (!session
                        || !session.account) {

                        deferred.resolve(null);
                    }
                    else {
                        that.getById(session.account)
                            .then(function(user) {
                                deferred.resolve(user);
                            })
                            .catch(function(err){deferred.reject(err)});
                    }
                })
                .catch(function(err) {deferred.reject(err);});

            return deferred.promise;
        },

        packageRoles: function(user) {
            if (!user) throw new Error('Invalid user');
            if (!user.roles) user.roles = [];

            var everyOne = role.roleNameOfEveryOne;

            if (user.roles.indexOf(everyOne) < 0) {
                user.roles.push(everyOne);
            }
        }
    };

    var group = {

    };

    return {
            role: role,
            group: group,
            user: user
        }
    };
