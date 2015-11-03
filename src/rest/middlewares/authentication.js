'use strict'
const aq = require('pitayax-service-core').aq

module.exports = (app) => {

    app.use((req, res, next) => {

      if (app.logger) {
        app.logger.verbose(`check permission for url: ${req.path} by http method: ${req.method}`, 'rest auth')
      }

      console.log(req.method.toLowerCase() + ': ' + req.path)
      //call rest full method for oauth adapter

      //process next middleware
      next()
    })
}
