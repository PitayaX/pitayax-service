import path from 'path';
import fs from 'fs';
import {ConfigMap} from './util/conf';

let debug = true;
if (debug){

    //get full file path for configuration
    let configFile = path.join(__dirname, 'config.json');

    //parse config json to an object
    let config = ConfigMap.parseJSON(fs.readFileSync(configFile, { encoding: 'utf-8' }));

    console.log ('version:' + config.Version);
    console.log ('json:' + config.toJSON());

    for(let [k, v] of config){
        console.log(`k:${k}, v:${JSON.stringify(v)}`);
    }
}
