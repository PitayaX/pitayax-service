import fs from 'fs';

export default class Conf{

    static parse(file)
    {
        //parse config file to an object
        let config = JSON.parse(fs.readFileSync(file), { encoding: 'utf-8' });

        let dict = new Map();

        //convert object to map object
        (function parseKeys(o, map) {

            //create new instance of Map if the arg doesn't exist
            if (!map) map = new Map();

            //fetch all key in object
            Object.keys(o).forEach(function(key) {

                //ingore comment or system key
                if (key.startsWith('#') || key.startsWith('@@')) return;

                //get value by key
                let value = o[key];

                //create new map for object value
                if (typeof value === 'object') {
                    map.set(key, parseKeys(value));
                    return;
                }

                if (typeof value === 'string') {

                    //allow use ${expression} to define a expression and apply it in runtime
                    if (value.startsWith('${') && value.endsWith('}')) {

                        //convert express to value
                        value = eval(value.substring(2, value.length -3));
                    }
                }

                map.set(key, value);   //set value by current key
            })

            //return created map
            return map;
        })(config, dict)

        //append system varints
        dict.version = (config['@@version'] !== undefined) ? config['@@version'] : '1.0.0';
        dict.description = (config['@@description'] !== undefined) ? config['@@description'] : '';

        return dict;
    }
}
