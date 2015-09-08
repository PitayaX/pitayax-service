import {} from './runtime';
import {} from 'events';

export class ConfigMap extends Map {

    constructor(...values)
    {
        super(...values);

        this.version = '1.0.0';
        this.description = '';
    }

    get Version() {return this.version;}
    get Description() {return this.description;}

    toJSON() {
        let output = {};
        output['@@versioni'] = this.version;
        output['@@description'] = this.description;

        (function fn(o, dict) {

            for(let [k, v] of o.entries()) {

                if (v.__proto__.toString() === '[object Map]')
                    dict[k] = fn(v, {});
                else dict[k] = v;
            }

            return dict;
        })(this, output);

        return JSON.stringify(output, null, 4);
    }

    static parseJSON(json) {
        return ConfigMap.parse(JSON.parse(json));
    }

    static parse(options) {

        let cMap = new ConfigMap();

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

                if (Array.isArray(value)){

                    for(let i = 0; i < value.length; i++) {
                        if (typeof value[i] === 'object')
                            value[i] = parseKeys(values[i]);
                    }

                    map.set(key, value);
                    return;
                }
                else if (typeof value === 'object') {
                    //create new map for object value
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
        })(options, cMap)

        //append system varints
        if (options['@@version'] !== undefined) cMap.version = options['@@version'];
        if (options['@@description'] !== undefined) cMap.description = options['@@description'];

        return cMap;
    }
}

export default {}
