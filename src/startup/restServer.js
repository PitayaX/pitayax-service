'use strict'
/**
 * Created by Bruce on 11/01/2015.
 */
const fs = require('fs')
const path = require('path')
const Server = require('./server.js')
const Data = require('pitayax-service-core').data

class RestServer extends Server
{
  constructor(conf)
  {
    super(conf)
  }

  initialize(app, conf)
  {
    const server = this

    //create function to report error
    if (!app.reportError) {

      app.reportError = (err, res) => {

        //output error for parse json body failed
        err.code = (err.code) ? err.code : -1

        //set response status code
        res.statusCode = (err.statusCode) ? err.statusCode : 400

        //create response database
        const data = {"error": {"code": err.code, "message": err.message, "status": res.statusCode}}

        //write error to logger
        if (app.logger) app.logger.error(`status: ${res.statusCode},\tmessage: ${err.message}`, server.Name)

        //output error message to response
        res.end(JSON.stringify(data, null, 2))
      }
    }

    super.initialize(app, conf)
  }

  setDatabases(app, conf)
  {
    super.setDatabases(app, conf)

    //initialize variants
    const server = this

    //get instance of connections
    const connections = this.connections

    //get config section for schemas
    const schemas = conf.get('$schemas')

    const appendSchema = (file) => {

      try {
        const buffer = fs.readFileSync(path.join(__dirname, file))  //read file
        const json = JSON.parse(buffer)   //parse buffer to JSON

        connections.appendSchema(json)    //append schema to connections
        app.logger.verbose(`appended schema file: ${file}`, server.Name)
      }
      catch(err) {

        //record error logger
        app.logger.error(`parse schema file (${file}) failed, details: ${err.message}`, server.Name)
      }
    }

    if (schemas !== undefined) {

      if (Array.isArray(schemas)) {
        schemas.forEach( file => appendSchema(file))  //append every item in schemas
      }
      else appendSchema(schemas)  //append one schema file
    }

    //set adapter
    if (app.adapters === undefined) {
      app.adapters = new Map()
    }

    const types = ['mongo']

    for(let i = 0; i < types.length; i++) {

      let adapter = undefined

      switch(types[i]) {
        case 'mongo':
          //create mongo adapter
          adapter = new Data.MongoDBAdapter(connections)

          //initialize mongo adapter
          if (adapter.ValidateBeforeSave !== undefined) {
            adapter.ValidateBeforeSave = true
          }

          //bind wrapper function
          //adapter.getWrapper = (name) => undefined

          break
        default:
          break
      }

      //append adapter
      app.adapters.set(types[i], adapter)
    }
  }

  setRoute(app)
  {
    //initialize variants
    const server = this

    //ignore request for favicon.ico
    app.use('/favicon.ico', (req, res, next) => { return })

    if (app.newRouter === undefined) {
      app.newRouter = () => require('express').Router()
    }

    //append middlewares from configuration
    let middlewaresConf = server.conf.get('middlewares')
    if (middlewaresConf) {

      //convert single middleware to array
      if (!Array.isArray(middlewaresConf)) {
        middlewaresConf = [middlewaresConf]
      }

      //append every middleware
      middlewaresConf.forEach( middleware => require(middleware)(app) )
    }

    //declare rest restRouter
    let restRouter = undefined

    //get config node from global configuration
    const restConf = server.conf.get('rest')

    //create new instance of rest router
    if (restConf && restConf.has('script')) {

      try
      {
        //get router class by file
        const Router = require(restConf.get('script'))

        restRouter = new Router(app)
      }
      catch(err)
      {

        app.logger.error(`Create new instance of router failed, details:${(err) ? err.message : 'unknown'}`, server.Name)
      }
    }

    //create root router
    if (restRouter !== undefined) {

      const parser = require('body-parser')

      //handle JSON body parser
      const options = {};

      if (app.settings.limitSize) options["limit"] = app.settings.limitSize
      app.use(parser.json(options))

      //handle rest router base on configuration
      const path = restConf.has('folder') ? restConf.get('folder') : '/'

      //bind create router function
      const routerBind = restRouter.createRouter.bind(restRouter, app)

      app.use(path, routerBind())
    }

    //catch no route request
    app.use(
      '*',
      (req, res) => {

        const
          err = new Error(`can't find file: ${req.baseUrl} from server`)
          err.code = 404
          err.statusCode = 404
        throw err
      }
    )

    //catch error
    app.use(
      (err, req, res, next) => {

        //hdndle error when occur in previous middlewares
        if (err) {

          //report error
          if (app.reportError) app.reportError(err, res)
          return
        }

        next()
    })
  }
}

module.exports = RestServer
