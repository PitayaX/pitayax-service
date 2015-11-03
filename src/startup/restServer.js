'use strict'
/**
 * Created by Bruce on 11/01/2015.
 */
const fs = require('fs')
const path = require('path')
const Server = require('./server.js')

class RestServer extends Server
{
  constructor(conf)
  {
    super(conf)

    this.name = conf.name
  }

  setDatabases(app, conf)
  {
    super.setDatabases(app, conf)

    const that = this
    const connections = that.connections

    const schemas = conf.get('$schemas')

    const appendSchema = (file) => {

      try {
        const buffer = fs.readFileSync(path.join(__dirname, file))
        const json = JSON.parse(buffer)

        connections.appendSchema(json)
      }
      catch(err) {

        if (app.logger) {

          app.logger.error(`parse schema file (${file}) failed, details: ${err.message}`, that.Name)
        }
      }
    }

    if (schemas !== undefined) {
      if (Array.isArray(schemas)) {
        schemas.forEach( file => appendSchema(file))
      }
      else appendSchema(schemas)
    }
  }

  setRoute(app)
  {
    //initialize variants
    const that = this

    //ignore request for favicon.ico
    app.use('/favicon.ico', (req, res, next) => { return })

    //append middlewares from configuration
    let middlewaresConf = that.conf.get('middlewares')
    if (middlewaresConf) {

      //convert single middleware to array
      if (!Array.isArray(middlewaresConf)) {

        middlewaresConf = [middlewaresConf]
      }

      //append every middleware
      middlewaresConf.forEach( middleware => {
        if (typeof middleware === 'string') {
          require(middleware)(app)
        }
        else if (typeof middleware === 'object') {

          for( let key of middleware.keys()) {
            require(key)(app, middleware.get(key))
          }
        }
        else {

        }
      })
    }


    //declare rest restRouter
    let restRouter = undefined

    //get config node from global configuration
    const restConf = that.conf.get('rest')

    if (restConf && restConf.has('script')) {
      try{
        //get router class by file
        const Router = require(restConf.get('script'))

        restRouter = new Router(app)
      }
      catch(err) {
        if (app.logger) {
          app.logger.error(`Create new instance of router failed, details:${(err) ? err.message : 'unknown'}`, 'rest')
        }
      }
    }

    if (restRouter !== undefined) {

      const path = restConf.has('folder') ? restConf.get('folder') : '/'

      //handle JSON body parser
      app.use(require('body-parser').json())

      if (app.logger) app.logger.info(`get path of rest: "${path}" for router.`)
      app.use(path, require('body-parser').json(), restRouter.createRoute(app))
    }

    app.use('/test', (req, res) => {
      res.end('test')
    })
  }
}

module.exports = RestServer
