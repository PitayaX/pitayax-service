'use strict'

class Router
{
  constructor(app)
  {
  }

  createRouter(app)
  {
    //set callback function
    const callback = this.callback

    //parse configuration file
    const conf = app.parseConf('/rest/routes/conf.yaml')

    //get instance of logger
    const logger = app.logger

    //create new instance of root router
    const rootRouter = app.newRouter()

    //get all route
    for (let key of conf.keys()) {

      const item = conf.get(key)

      try
      {
        //output log entries
        logger.info(`start to create router for ${key}`, app.appName)

        //get variants from configuration
        const path = item.has('path') ? item.get('path') : '/'
        const routerFile = item.has('router') ? item.get('router') : './restRouter.js'
        const adapterFile = item.has('adapter') ? item.get('adapter') : undefined
        const methodsConf = item.has('methods') ? item.get('methods') : new Map()

        //get class for router and adapter
        const Router = require(routerFile)
        const Adapter = (adapterFile !== undefined) ? require(adapterFile) : undefined

        //can't find router class, throw exception
        if (!Router || typeof Router !== 'function') {

          //record errors
          logger.error(`can't find definition for router by ${key}.`, app.appName)

          //throw new exception
          throw new Error(`Can't create router by file ${routerFile}`)
        }

        //create new instance of router
        const router = new Router(app)

        //output message to logger
        logger.verbose('created instance of router', app.appName)

        //create new instance of router adapter
        const adapter = (Adapter && typeof Adapter === 'function') ? new Adapter(app) : {}

        //output message to logger
        logger.verbose('created instance of adapter', app.appName)

        //initialize varinats of adapter
        if (adapter.key === undefined) adapter.key = key

        //create bind function for router
        const routerBind = router.createRouter.bind(router, app, methodsConf, adapter, callback)

        //output message to logger
        logger.verbose('bound router function', app.appName)

        //create sub router by configuration
        rootRouter.use(path, routerBind())

        //output message to logger
        logger.verbose('append sub-router to root', app.appName)
      }
      catch(err) {

        //write error info to logger
        logger.error(`failed to create route for ${key}, details: ${(err) ? err.message : 'unknown'}`, app.appName)

        //ignore current adapter
        continue
      }
    }

    //return root router
    return rootRouter
  }

  callback(req, res, err, result, app)
  {
    if (err && err.stop) return

    const that = app
    const conf = (app.conf) ? app.conf : new Map()
    const restConf = (conf.has('rest')) ? conf.get('rest') : new Map()

    let origin = (restConf.has('crossDomain')) ? (restConf.get('crossDomain') || '*') : '*'

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
