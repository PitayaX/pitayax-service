'use strict'

let http = require('http')
let Express = require('express')
let Logger = require('pitayax-service-core').Logger
let Data = require('pitayax-service-core').data

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
    let that = this
    that.express = express

    let conf = that.conf
    let app = express

    app.appName = that.Name
    app.conf = conf

    //assign variants from conf to settings
    Object.keys(that.settings)
      .filter( key => (!key.startsWith('#')))
      .forEach(key => app.set(key, that.settings[key]))

      //assign variants from conf to locals
    Object.keys(that.locals)
      .filter( key => (!key.startsWith('#')))
      .forEach( key => app.locals[key] = that.locals[key] )

    //initialize logger
    if (conf.has('logger')) {
      that.setLogger(app, conf.get('logger'))
    }

    //set database
    if (conf.has('databases')) {
      process.nextTick( () => {
        that.setDatabases(app, conf.get('databases'))
      })
    }

    //set route
    that.setRoute(app)
  }

  setRoute(app)
  {

  }

  setLogger(app, conf)
  {
    let that = this
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

    app.logger = logger
    that.logger = logger
  }

  setDatabases(app, conf)
  {
    let that = this
    let connections = new Data.MongoDBConnections()

    for( let entry of conf.entries() )
    {
      let name = entry[0]
      let database = entry[1]

      let connectionString = database.get('connectionString')
      if (!connectionString || connectionString.startsWith('#')) continue

      let options = database.has('options') ? database.get('options').toObject() : undefined

      connections.create(name, connectionString, options)
    }

    connections.on('connected', conn => {
      if (that.logger) {

        that.logger.info(`The connection for ${conn.Name} was connected`, that.Name)
      }
    })

    connections.on('open', conn => {
      if (that.logger) {

        that.logger.info(`The connection for ${conn.Name} was opened`, that.Name)
      }
    })

    connections.on('close', conn => {
      if (that.logger) {

        that.logger.info(`The connection for ${conn.Name} was closed`, that.Name)
      }
    })

    connections.on('disconnected', conn => {
      if (that.logger) {

        that.logger.info(`The connection for ${conn.Name} was disconnected`, that.Name)
      }
    })

    connections.on('error', (err, conn) => {
      if (that.logger) {
        that.logger.error(`database occur unknown error, details: ${ (err) ? err.message : ''}`, that.Name)
      }
    })

    app.connections = connections
    that.connections = connections
  }

  start()
  {
    let that = this

    if (that.express !== undefined) {

      try{

        that.instance
          = http.createServer(that.express)
              .listen(that.port, (err) => {
                                      if (err) {

                                        if (that.logger) {

                                          that.logger.error(`server :${that.Name} start failed, details: ${err.message}`, that.Name)
                                        }
                                      }
                                    })

        let message = `server: ${that.Name} started.`
        if (that.logger) {

          that.logger.info(message, that.Name)
        }
        console.log(message)
      }
      catch(err) {

        if (that.logger) {

          that.logger.error(`server :${that.Name} start failed, details: ${ (err) ? err.message : 'unknown' }`, that.Name)
        }
      }
    }
  }

  stop()
  {
    let that = this

    //close database
    if (that.connections !== undefined)
    {
      if (that.connections instanceof Data.MongoDBConnections)
      {
        that.connections.Names
          .forEach( name => {
            that.connections.close(name)
        })
      }
    }

    //close instance of TCP
    if (that.instance !== undefined) {
      that.instance.close()
      that.instance = undefined
    }

    let message = `server: ${that.Name} stopped.`
    if (that.logger) {

      that.logger.info(message, that.Name)
    }
    console.log(message)
  }

  createDatabases(settings)
  {
  }
}

module.exports = Server
