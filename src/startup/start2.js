'use strict'

let fs = require('fs')
let path = require('path')
let ConfigMap = require('pitayax-service-core').ConfigMap

/*
if (!String.prototype.startsWith) {
    String.prototype.startsWith
        = (prefix) => this.indexOf(prefix + '$') === 0
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith
        = (suffix) => this.match(suffix + '$') === suffix
}
*/

let parseConf
    = (file) => {
        //check configuration file exists or not
        if (!fs.existsSync(file))
            file = path.join(__dirname, file)

        if (!fs.existsSync(file)) throw new Error(`can't find configuration file: ${file}`)

        let info = path.parse(file);
        if (!info) info = {"dir": __dirname, "name": "file", "ext": ""}   //set default file info

        let parse = (ext, obj) => {
            switch(ext) {
                case '.json':
                    return ConfigMap.parseJSON(obj)
                case '.yaml':
                    return ConfigMap.parseYAML(obj)
                default:
                    return new ConfigMap()
            }
        }

        let conf = parse(info.ext, fs.readFileSync(file, 'utf-8'))

        file = path.join(info.dir, `${info.name}.debug${info.ext}`)
        console.log(file)
        if (fs.existsSync(file)) {
            let debugConf = parse(info.ext, fs.readFileSync(file, 'utf-8'))
            conf.merge(debugConf)
        }

        return conf
    }

//parse global configuration file
let globalConf = parseConf('servers.yaml')

let databases = globalConf.get('databases');
let servers = globalConf.get('servers');

if (servers !== undefined) {
    servers
        .filter( server => server.get('config').indexOf('#') !== 0 )
        .forEach( server => {
            let configFile = server.get('config')
            let scriptFile = server.get('script')

            let serverConf = parseConf(configFile)

            serverConf.merge(globalConf)
            let m = serverConf.get('databases')
            if (m instanceof Map) {
                for( let name of m.keys()) {

                    let val = m.get(name)
                    console.log(`${name}: ${val.toJSON()}`);
                }
            }
        });
}
