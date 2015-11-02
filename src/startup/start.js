'use strict'

let fs = require('fs')
let path = require('path')

let ConfigMap = require('pitayax-service-core').ConfigMap
let Logger = require('pitayax-service-core').Logger
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

  let app = undefined
  for (let server of servers.entries()) {
    if (server.port === port) app = server.Express
  }

  if (app === undefined) app = new Express()
  app.parseConf = parseConf

  return app
}

let getLogger = (conf) => {

  let logFile = conf.get('file') || 'output.log'

  let outputter = Logger.createFileOutputter(logFile)
  let logger = new Logger(outputter)

  if (conf.has('lineFormat')) {
    logger.lineFormat = conf.get('lineFormat')
  }

  if (conf.has('level')) {
    let levels = conf.get('level')

    for (let name of levels.keys()) {
      if (name === 'default') logger.Level = levels.get(name)
      else logger.setLogLevel(levels.get(name))
    }
  }

  return logger
}

//create servers
let servers = new Map();
let logger = undefined;

let start = () => {

  //parse global configuration file
  let globalConf = parseConf('servers.yaml')

  logger = getLogger(globalConf.get('logger'))

  //get servers configuration from global
  let serverItems = globalConf.get('servers')

  if (serverItems !== undefined) {

    //fetch every item in servers configuration
    serverItems
      .filter( serverItem => serverItem.get('config').indexOf('#') !== 0 )  //ignore comment server
      .forEach( serverItem => {

        try{

          //clone configuration from global
          let conf = globalConf.clone()

          //parse configuration file for current server
          conf.merge(parseConf(serverItem.get('config')))

          //get type of server
          let Server = require(serverItem.get('script'))

          //create new instance of server
          let server = new Server(conf)

          //set express application server
          server.setExpress(getExpress(servers, server.port))

          //start server
          server.start()

          //append server to Map if it was started
          servers.set(server.name, server)
        }
        catch(err) {

          //log error
          if (logger) {
            logger.error(`Unknown issue occurs when starting servers, details: ${ (err) ? err.message : 'unknown' }` , 'global')
          }
        }
      })
  }
}

let stop = () => {

  //if exists servers Map
  if (servers) {

    //get every server from Map
    for(let server of servers.values()) {

        //stop servers
        server.stop()
    }

    servers.clear()

    if (logger) {
      logger.info('all servers were stopped.', 'global')
    }
  }
}

process.on('uncaughtException', (err) => {
  if (logger) {
    //catch error
    logger.error(`Uncaught error occurs, details: ${ (err) ? err.message: 'unknown' }`, 'global')
  }
});

process.on('beforeExit', () => {
  if (logger) {
    //catch event
    logger.info('catch event before exit', 'global')

    stop()
  }
})

process.on('exit', (code) => {
  if (logger) {
    //catch event
    logger.info(`catch event exit with code (${code}).`, 'global')
  }
})

start()

//setTimeout( () => stop(), 2000)
