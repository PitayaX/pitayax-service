import path from 'path';
import fs from 'fs';
import {ConfigMap, TEvent} from './util/conf';

//console.log(IIf(2===2, 1, 2));

let te = new TEvent();

te.on('message', (...args)=>{if (args.length > 0) console.log(args[0])});
te.test('good');

let debug = true;
if (debug){

    //get full file path for configuration
    let configFile = path.join(__dirname, 'config.json');
    //callee

    //parse config json to an object
    let config = ConfigMap.parseJSON(fs.readFileSync(configFile, { encoding: 'utf-8' }));

    //let a = ConfigMap.parse({"a1":1, "a2":2});
    let a = new ConfigMap();
    a.copy(config.get('databases'));
    a.on('message', (...args)=>{console.log(args[0])});

    console.log ('json a:' + a.toJSON());

    console.log ('version:' + config.Version);

    console.log ('json config:' + config.toJSON(true));

    for(let [k, v] of config){
        //console.log(`k:${k}, v:${JSON.stringify(v)}`);
    }
}
