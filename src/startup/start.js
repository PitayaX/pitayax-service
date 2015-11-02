'use strict'

let fs = require('fs')
let path = require('path')

let ConfigMap = require('pitayax-service-core').ConfigMap
let Express = require('express')
let Server = require('./server.js')

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

    let target = 'debug'

    file = path.join(info.dir, `${info.name}.${target}${info.ext}`)
    if (fs.existsSync(file)) {
      let targetConf = parse(info.ext, fs.readFileSync(file, 'utf-8'))
      conf.merge(targetConf)
    }

    return conf
  }

let getExpress = (servers, port) => {
  for (let server of servers.entries()) {
    if (server.port === port) return server.Express
  }

  return new Express()
}

//parse global configuration file
let globalConf = parseConf('servers.yaml')

//create servers
let servers = new Map();
let serverItems = globalConf.get('servers');

if (serverItems !== undefined) {
  serverItems
    .filter( serverItem => serverItem.get('config').indexOf('#') !== 0 )
    .forEach( serverItem => {

      //get type of server
      let Server = require(serverItem.get('script'))

      //clone configuration from global
      let conf = globalConf.clone()

      //parse configuration file for current server
      conf.merge(parseConf(serverItem.get('config')))

      //create new instance of server
      let server = new Server(conf)

      //set express application server
      server.setExpress(getExpress(servers, server.port))
      servers.set(server.name, server)

      //start server
      server.start()
      server.stop()
    })
}
