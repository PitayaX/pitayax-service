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
    //ignore request for favicon.ico
    app.use('/favicon.ico', (req, res, next) => { return })

    //handle JSON body parser
    app.use(require('body-parser').json())

    app.use('/test', (req, res) => {
      res.end('test')
    })
  }
}

module.exports = RestServer
