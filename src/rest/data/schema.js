/**
 * Created by Bruce on 3/17/2015.
 */
var fs = require('fs');
var path = require('path');

function mergeSchema(app) {

    var count = 0;

    //get config object from file.
    var config = app.readConfig(__dirname);

    //init merged schema
    var newSchema = { "database": {}, "entity": {} };

    //read all files defined in schemas folder
    fs.readdirSync(path.join(__dirname, 'schemas'))
        .filter(function(f) {
            //ignore the files that starts with '.'
            return !(f.indexOf('.') === 0)
        })
        .map(function(f) {
            //map full file name
            return path.join(__dirname, 'schemas', f);
        })
        .forEach(function(f) {
            //parse schema file by path
            var schema = JSON.parse(fs.readFileSync(f, { encoding: 'utf-8' }));

            //merge all database connection
            if (schema.database) {

                Object.keys(schema.database)
                    .forEach(function(name) {

                    var newName = getMergedDBName(name, count);
                    newSchema.database[newName] = schema.database[name];
                });
            }

            //merge entity and update the database settings
            if (schema.entity) {
                Object.keys(schema.entity)
                    .forEach(function(name){

                        var item = schema.entity[name];
                        if (!item.database) {
                            if (count > 0) {
                                item['database'] = getMergedDBName('default', count);
                            }
                        }
                        else {
                            item['database'] = getMergedDBName(item.database, count);
                        }

                        newSchema.entity[name] = item;
                    });
            }

            count++;
        });

    //console.log('ns:' + JSON.stringify(newSchema));
    return newSchema;
}

function getMergedDBName(name, count) {
    return (count > 0) ? (name + '_' + count.toString()) : name;
}

var mergedSchema = null;

module.exports = function (app, name) {

    if (!mergedSchema) {
        mergedSchema = mergeSchema(app);
    }

    if (!name) {
        return mergedSchema;
    }

    //failed
    return app.getConfig(__dirname, name + '.json');
};
