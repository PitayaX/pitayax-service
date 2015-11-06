'use strict'

const fs = require('fs')
const path = require('path')

const ConfigMap = require('pitayax-service-core').ConfigMap
const Logger = require('pitayax-service-core').Logger
const Express = require('express')
const Server = require('./server.js')

global.appName = 'global'
global.target = 'debug'
global.servers = new Map()
global.dir = path.parse(__dirname).dir

//process arguments
process
  .argv
  .forEach(
    arg => {
      switch(arg){
        case '-release':
          global.target ='release'
          break
        case '-debug':
          global.target ='debug'
          break
        default:
          break
      }
    })

//define function to parse configuration by file name
global.parseConf
  = (file) => {

    //declare
    let cfile = file
    let cfs = undefined

    //check origina file
    try {cfs = fs.statSync(cfile)} catch(err){}

    //check
    if (cfs === undefined) {
      cfile = path.join(global.dir, file)
      try {cfs = fs.statSync(cfile)} catch(err){}
    }

    if (cfs === undefined) {
      cfile = path.join(__dirname, file)
      try {cfs = fs.statSync(cfile)} catch(err){}
    }

    //can't find configuration file, throw new error
    if (cfile === undefined) {
      throw new Error(`can't find configuration file: ${file}`)
    }

    //parse file
    const info = path.parse(cfile);
    if (!info) {
      //set default file info
      info = {
        "dir": global.dir,
        "name": "file",
        "ext": ""
      }
    }

    //parse by different extend name
    const parse = (ext, file) => {

      const obj = fs.readFileSync(file, 'utf-8')
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
    const conf = parse(info.ext, cfile)

    //merge debug or release file
    cfile = path.join(info.dir, `${info.name}.${global.target}${info.ext}`)

    try{
      cfs = fs.statSync(cfile)
      conf.merge(parse(info.ext, cfile))
    }
    catch(err){}

    return conf
  }

//define function to get applicaton of express
global.getExpress = (servers, port) => {

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
global.getLogger = (conf) => {

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
      else logger.setLogLevel(name, levels.get(name))
    }
  }

  return logger
}

//create servers
let logger = undefined

const start = () => {

  //parse global configuration file
  const globalConf = parseConf('servers.yaml')

  logger = global.getLogger(globalConf.get('logger'))

  //get servers configuration from global
  const serverItems = globalConf.get('servers') || []

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
        server.setExpress(global.getExpress(global.servers, server.port))

        //start server
        server.start()

        //append server to Map if it was started
        global.servers.set(server.name, server)
      }
      catch(err) {
        //log error
        if (logger) logger.error(`Unknown issue occurs when starting servers, details: ${ (err) ? err.message : 'unknown' }` , global.appName)
      }
    } )
}

let stop = () => {

  //if exists servers Map
  if (global.servers) {

    //get every server from Map
    for(let server of global.servers.values()) {

        //stop servers
        server.stop()
    }

    global.servers.clear()

    if (logger) {
      logger.info('all servers were stopped.', global.appName)
    }
  }
}

process.on('uncaughtException', (err) => {

  if (logger) {
    //catch error
    logger.error(`Uncaught error occurs, details: ${ (err) ? err.message: 'unknown' }`, global.appName)
  }
});

process.on('beforeExit', () => {

  if (logger) {
    //catch event
    logger.info('catch event before exit', global.appName)
  }

  stop()
})

process.on('exit', (code) => {

  console.log('a')
  if (logger) {
    //catch event
    logger.info(`catch event exit with code (${code}).`, global.appName)
  }
})

start()

//setTimeout( () => stop(), 2000)
