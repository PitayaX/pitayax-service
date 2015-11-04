'use strict'

const path = require('path')
const Express = require('express')
const ConfigMap = require('pitayax-service-core').ConfigMap
const AppName = 'rest'

class Router
{
  constructor(app)
  {
    this.app = app
    this.conf = (app.conf) ? app.conf : new Map()
    this.restConf = this.conf.has('rest') ? this.conf.get('rest') : new Map()
    this.logger = (app.logger) ? app.logger : undefined
  }

  createRoute()
  {
    let that = this
    let app = that.app || {}

    //parse configuration file
    let conf = app.parseConf(path.join(__dirname, 'conf.yaml'))
    let rootRouter = require('express').Router()

    //get all route
    for(let key of conf.keys()) {

      let item = conf.get(key)

      try {

        let path = item.has('path') ? item.get('path') : '/'
        let routerFile = item.has('router') ? item.get('router') : './restRouter.js'
        let adapterFile = item.has('adapter') ? item.get('adapter') : undefined
        let methodsConf = item.has('methods') ? item.get('methods') : new Map()

        if (adapterFile === 'undefined') {

          //ignore current adapterFile
          if (app.logger) {
            app.logger.warning(`Can't find adapter file for route ${key}`, 'rest')
          }
          continue
        }

        //get class for router and adapter
        const Router = require(routerFile)
        const Adapter = (adapterFile !== undefined) ? require(adapterFile) : undefined

        //create new instance of router and adapter
        if (!Router || typeof Router !== 'function') throw new Error(`Can't create router by file ${routerFile}`)
        const router = new Router(app)
        const adapter = (Adapter && typeof Adapter === 'function') ? new Adapter(app) : {}

        //initialize varinats of adapter
        adapter.key = key

        //create sub router by configuration
        rootRouter.use(path, router.createRouter(methodsConf, adapter, that.callback))
      }
      catch(err) {

        if (app.logger) {
          app.logger.error(`failed to create route for ${key}, details: ${(err) ? err.message : 'unknown'}`, AppName)
        }

        continue
      }
    }

    return rootRouter
  }

  callback(req, res, err, result, app)
  {
    const that = app
    const conf = (app.conf) ? app.conf : new Map()
    const restConf = (conf.has('rest')) ? conf.get('rest') : new Map()

    let origin = (restConf.has('crossDomain')) ? (that.restConf.get('crossDomain') || '*') : '*'

    //set headers to response for rest settings
    res.setHeader("Access-Control-Allow-Origin", origin)   //allow cross domain to access REST services
    res.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Max-Age", "3628800")
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token")

    if (req.token) {
        res.setHeader('token', req.token);
        res.setHeader("ETag", req.token);
    }

    if (err) {
      if (err.statusCode) res.statusCode = err.statusCode
    }

    let toJSON = (data) => {

      //format response JSON
      let pretty = restConf.has('pretty') ? restConf.get('pretty') : false
      if (pretty) {
        res.write(JSON.stringify(data, null, 2))
        res.end();
      }
      else res.json(data)
    }

    //output JSON for error node
    if (err) {

        //append error to logger
        if (that.logger) {
          that.logger.error(`Execute restful API failed, details: ${err.message}`, AppName)
        }

        //res.statusCode = (err.statusCode) ? err.statesCode : 500

        const code = (err.code) ? err.code : -1
        toJSON({ "error": { "code": code, "message": err.message } })
    } else {
        //output JSON for result
        toJSON(result);
    }
  }
}

module.exports = Router
