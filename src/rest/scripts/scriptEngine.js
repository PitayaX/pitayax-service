/**
 * Created by Bruce on 8/20/2015.
 */
var fs = require('fs');
var path = require('path');
var U = require('underscore');


module.exports = function(){

    var engine = {

        //define function to parse pre-define script by path
        parse: function(scriptPath){
          if (!fs.existsSync(scriptPath)) {
              return null;
          }

          //read report text from defined file
          eval(fs.readFileSync(scriptPath, { encoding: 'utf-8' }));

          return $$;
        },

        //define function to convert argument by type
        convertArg: function(arg, argType){

            if(U.isArray(arg)) {
                for(var i = 0; i < arg.length; i++){
                    arg[i] = that.convertArg(arg[i], argType)
                }

                return arg;
            }

            if (argType){
                switch(argType){
                    case "int":
                        arg = parseInt(arg);
                        break;
                    case "float":
                        arg = parseFloat(arg);
                        break;
                    default :
                        break;
                }
            }

            return arg;
        },

        //define function to process arguments in predefined script
        fillArgs: function(script, args){

            for(var key in script){

                //console.log('sk: ' + key);
                if (script[key] && U.has(args, script[key])){
                    script[key] = args[script[key]];
                }

                if (script[key] && typeof(script[key]) == 'object'){
                    that.fillArgs(script[key], args);
                }
            }

            return script;
        }
    };

    var that = engine;

    return engine;
};