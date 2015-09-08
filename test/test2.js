import path from 'path';
import fs from 'fs';
import {ConfigMap} from './util/conf';

console.log(IIf(2===2, 1, 2));

let debug = true;
if (debug){

    //get full file path for configuration
    let configFile = path.join(__dirname, 'config.json');

    //parse config json to an object
    let config = ConfigMap.parseJSON(fs.readFileSync(configFile, { encoding: 'utf-8' }));

    config.on('message', (...args) => { if (args.length > 0) console.log(args[0]); })

    console.log ('version:' + config.Version);

    console.log('start');
    console.log ('json:' + config.toJSON());
    console.log('end');

    for(let [k, v] of config){
        console.log(`k:${k}, v:${JSON.stringify(v)}`);
    }
}
