'use strict'
/**
 * Created by Bruce on 11/01/2015.
 */
let Server = require('./server.js')

class RestServer extends Server
{
  constructor(conf)
  {
    super(conf)
    this.name = conf.name
  }

  setRoute(app)
  {
    //initialize variants
    let that = this

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
        //require(middleware)(app)
      })
    }

    let restConf = that.conf.get('rest')
    let restRouter = undefined

    if (restConf && restConf.has('script')) {
      try{
        let Router = require(restConf.get('script'))

        restRouter = new Router(app)
      }
      catch(err) {
        if (app.logger) {
          app.logger.error(`Create new instance of router failed, details:${(err) ? err.message : 'unknown'}`, 'rest')
        }
      }
    }

    if (restRouter !== undefined) {

      let path = restConf.has('folder') ? restConf.get('folder') : '/'

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
