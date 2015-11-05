'use strict'

const http = require('http')
const Express = require('express')
const Logger = require('pitayax-service-core').Logger
const Data = require('pitayax-service-core').data

class Server
{
  constructor(conf, express)
  {
    this.conf = conf
    this.settings = (conf.get('settings') || new Map()).toObject()
    this.locals = (conf.get('locals') || new Map()).toObject()
    this.port = this.settings.port || 8080

    this.express = undefined
    this.instance = undefined

    this.connections = undefined
    this.logger = undefined
  }

  get Express() { return this.express }
  get Name() { return this.conf.get('name') || 'unknown' }
  get Port(){ return  this.settings.port || 8000}

  setExpress(express)
  {
    //get
    const
      server = this
      server.express = express

    //set application name and configuration
    const
      app = express
      app.appName = (server.Name) ? server.Name : 'unknown'
      app.conf = (server.conf) ? server.conf : new Map()

    //assign variants from conf to settings
    Object.keys(server.settings)
      .filter( key => (!key.startsWith('#')) )
      .forEach( key => app.set(key, server.settings[key]) )

      //assign variants from conf to locals
    Object.keys(server.locals)
      .filter( key => (!key.startsWith('#')) )
      .forEach( key => app.locals[key] = server.locals[key] )

    //get configuration
    this.initialize(app, app.conf)
  }

  initialize(app, conf)
  {
    //initialize logger
    if (conf.has('logger')) {
      this.setLogger(app, conf.get('logger'))
    }

    //set database
    if (conf.has('databases')) {
      this.setDatabases(app, conf.get('databases'))
    }

    //set route
    if (this.setRoute) this.setRoute(app)
  }

  //set logger settings
  setLogger(app, conf)
  {
    const that = this
    const logFile = conf.get('file') || 'output.log'

    const outputter = Logger.createFileOutputter(logFile)
    const logger = new Logger(outputter)

    //change line format by config value
    if (conf.has('lineFormat')) {
      logger.lineFormat = conf.get('lineFormat')
    }

    //change level by application name
    if (conf.has('level')) {
      const levels = conf.get('level')

      for (let name of levels.keys()) {
        if (name === 'default') logger.Level = levels.get(name)
        else logger.setLogLevel(levels.get(name))
      }
    }

    app.logger = logger
    that.logger = logger
  }

  //set database settings
  setDatabases(app, conf)
  {
    const that = this
    const mongoConnections = new Data.MongoDBConnections()

    for( let entry of conf.entries() )
    {
      //get name and database settings from configuration
      const name = entry[0]
      const database = entry[1]

      //ignore system name
      if (name.startsWith('$')) continue

      //get connection from conf
      const connectionString = database.get('connectionString')

      //ignore if connectionString is empty of starts with '#'
      if (!connectionString || connectionString.startsWith('#')) continue

      const type = database.has('type') ? database.get('type') : 'mongodb'

      //get options from conf
      const options = database.has('options') ? database.get('options').toObject() : undefined

      if (type === 'mongodb' || type === 'mongo') {

        //create new connection for mongodb
        mongoConnections.create(name, connectionString, options)
      }
    }

    //handle connected event of connections
    mongoConnections.on('connected', conn => {

      //output info to logger
      if (app.logger) app.logger.info(`The connection for ${conn.Name} was connected`, that.Name)
    })

    //handle open event of connections
    mongoConnections.on('open', conn => {

      //output info to logger
      if (app.logger) app.logger.info(`The connection for ${conn.Name} was opened`, that.Name)
    })

    //handle close event of connections
    mongoConnections.on('close', conn => {

      //output info to logger
      if (app.logger) app.logger.info(`The connection for ${conn.Name} was closed`, that.Name)
    })

    //handle disconnected event of connections
    mongoConnections.on('disconnected', conn => {

      //output info to logger
      if (app.logger) app.logger.info(`The connection for ${conn.Name} was disconnected`, that.Name)
    })

    //handle error event of connections
    mongoConnections.on('error', (err, conn) => {

      //output error to logger
      if (app.logger) app.logger.error(`database occur unknown error, details: ${ (err) ? err.message : ''}`, that.Name)
    })

    app.connections = mongoConnections

    that.connections = mongoConnections
  }

  //set children routers
  setRoute(app)
  {
    //set routers for inherits class
  }

  start()
  {
    const server = this

    if (server.Express !== undefined) {

      try{

        //create web server and start it
        server.instance
          = http
              .createServer(server.Express)
              .listen(server.port, (err) => {})

        //get server start message
        const message = `server: ${server.Name} started.`

        //write info to logger
        if (server.logger) server.logger.info(message, server.Name)

        //output info to console
        console.log(message)
      }
      catch(err) {

        //write error to logger
        if (server.logger) {
          server.logger.error(`server :${server.Name} start failed, details: ${ (err) ? err.message : 'unknown' }`, server.Name)
        }
      }
    }
  }

  stop()
  {
    let server = this

    //close database
    if (server.connections !== undefined)
    {
      if (server.connections instanceof Data.MongoDBConnections)
      {
        server.connections.Names
          .forEach( name => {
            server.connections.close(name)
        })
      }
    }

    //close instance of TCP
    if (server.instance !== undefined) {

      //close and release
      server.instance.close()
      server.instance = undefined
    }

    //get message when server stoping
    const message = `server: ${server.Name} stopped.`

    //write info to logger and console
    if (server.logger) server.logger.info(message, server.Name)
    console.log(message)
  }
}

module.exports = Server
