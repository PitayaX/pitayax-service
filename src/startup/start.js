'use strict'

const fs = require('fs')
const path = require('path')

const ConfigMap = require('pitayax-service-core').ConfigMap
const Logger = require('pitayax-service-core').Logger
const Express = require('express')
const Server = require('./server.js')

const AppName = 'global'

//define function to parse configuration by file name
const parseConf
  = (file) => {
    //can't find file in current folder, append current dir to check it again
    if (!fs.existsSync(file)) file = path.join(__dirname, file)
    if (!fs.existsSync(file)) throw new Error(`can't find configuration file: ${file}`)

    //parse file
    const info = path.parse(file);
    if (!info) info = {"dir": __dirname, "name": "file", "ext": ""}   //set default file info

    //parse by different extend name
    const parse = (ext, obj) => {
      switch(ext) {
        case '.json':
          return ConfigMap.parseJSON(obj)
        case '.yaml':
          return ConfigMap.parseYAML(obj)
        default:
          return new ConfigMap()
      }
    }

    //get configuration by file
    const conf = parse(info.ext, fs.readFileSync(file, 'utf-8'))

    //merge debug or release file
    let target = 'debug'

    file = path.join(info.dir, `${info.name}.${target}${info.ext}`)
    if (fs.existsSync(file)) {

      const targetConf = parse(info.ext, fs.readFileSync(file, 'utf-8'))
      conf.merge(targetConf)
    }

    return conf
  }

//define function to get applicaton of express
const getExpress = (servers, port) => {

  //delcare application
  let app = undefined
  for (let server of servers.entries()) {

    //found the server with same port, use current instance
    if (server.port === port) {
      app = server.Express
      break
    }
  }

  //can't get application form exists server, create new instance
  if (app === undefined) app = new Express()

  //bind parse function
  app.parseConf = parseConf

  //return instance of application
  return app
}

//define function to get logger
const getLogger = (conf) => {

  //get log file name
  const logFile = conf.get('file') || 'output.log'

  //create file outputter for log
  const outputter = Logger.createFileOutputter(logFile)

  //create new instance of logger by outputter
  const logger = new Logger(outputter)

  if (conf.has('lineFormat')) {
    logger.lineFormat = conf.get('lineFormat')
  }

  if (conf.has('level')) {
    const levels = conf.get('level')

    for (let name of levels.keys()) {
      if (name === 'default') logger.Level = levels.get(name)
      else logger.setLogLevel(levels.get(name))
    }
  }

  return logger
}

//create servers
const servers = new Map();
let logger = undefined;

const start = () => {

  //parse global configuration file
  const globalConf = parseConf('servers.yaml')

  logger = getLogger(globalConf.get('logger'))

  //get servers configuration from global
  const serverItems = globalConf.get('servers')

  if (serverItems !== undefined) {

    //fetch every item in servers configuration
    serverItems
      .filter( serverItem => serverItem.get('config').indexOf('#') !== 0 )  //ignore comment server
      .forEach( serverItem => {

        try{

          //clone configuration from global
          const conf = globalConf.clone()

          //parse configuration file for current server
          conf.merge(parseConf(serverItem.get('config')))

          //get type of server
          const Server = require(serverItem.get('script'))

          //create new instance of server
          const server = new Server(conf)

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
            logger.error(`Unknown issue occurs when starting servers, details: ${ (err) ? err.message : 'unknown' }` , AppName)
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
      logger.info('all servers were stopped.', AppName)
    }
  }
}

process.on('uncaughtException', (err) => {

  if (logger) {
    //catch error
    logger.error(`Uncaught error occurs, details: ${ (err) ? err.message: 'unknown' }`, AppName)
  }
});

process.on('beforeExit', () => {

  if (logger) {
    //catch event
    logger.info('catch event before exit', AppName)
  }

  stop()
})

process.on('exit', (code) => {
  if (logger) {
    //catch event
    logger.info(`catch event exit with code (${code}).`, AppName)
  }
})

start()

//setTimeout( () => stop(), 2000)
