'use strict'
/**
 * Created by Bruce on 11/01/2015.
 */
const Server = require('./server.js')

class FileServer extends Server
{
  constructor(conf)
  {
    super(conf)

    this.name = conf.name
  }

  setDatabases(app, conf)
  {
  }

  setRoute(app)
  {
    //ignore request for favicon.ico
    app.use('/favicon.ico', (req, res, next) => { return })

    //use file ass
    app.use('/', require('../file/router.js')(app))
  }
}

module.exports = FileServer
