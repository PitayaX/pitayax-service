'use strict'

const Express = require('express')
const ConfigMap = require('pitayax-service-core').ConfigMap

class Router
{
  constructor(app)
  {
    this.app = app
    this.conf = (app.conf) ? app.conf : new Map()
    this.restConf = this.conf.has('rest') ? this.conf.get('rest') : new Map()
  }

  createRoute()
  {
    let that = this
    let app = that.app || {}

    //parse configuration file
    let conf = app.parseConf('/rest/routes/conf.yaml')
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

          //write info to logger if can't find adapter file
          app.logger.warning(`Can't find adapter file for route ${key}`, app.appName)

          //ignore current adapterFile
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

        //write error info to logger
        app.logger.error(`failed to create route for ${key}, details: ${(err) ? err.message : 'unknown'}`, app.appName)

        //ignore current adapter
        continue
      }
    }

    return rootRouter
  }

  callback(req, res, err, result, app)
  {
    if (err && err.stop) return

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

    //set token to response
    const access_token = req['access_token']
    if (access_token !== undefined) {
        res.setHeader('access_token', access_token);
        res.setHeader("ETag", access_token);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8")

    //define a method to convert data to json string
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

      if (app.reportError) {
        app.reportError(err, res)
      }
      else toJSON(err)
    }
    else {
      //output JSON for result
      toJSON(result);
    }
  }
}

module.exports = Router
