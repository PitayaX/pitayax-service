'use strict'
const aq = require('pitayax-service-core').aq

module.exports = (app, conf) => {

    if (conf === undefined) conf = new Map()

    const reportError = (req, res, err) => {

      const data = {"err":{"code":-1, "message": ((err) ? err.message : 'unknown')}}

      if (app.logger) {
        app.logger.error(`authorization failed, details: ${(err) ? err.message : 'unknown'}`)
      }

      res.end(JSON.stringify(data, null, 2))
    }

    app.use((req, res, next) => {

      if (app.logger) {
        app.logger.verbose(`check permission for url: ${req.path} by http method: ${req.method}`, 'rest auth')
      }

      const access_token = req.headers['access_token']

      if (access_token === undefined) {

        const ignore = conf.has('ignore') ? conf.get('ignore') : false
        if (!ignore)
          reportError(req, res, new Error(`Can't find token in headers`))
        else next()
        return
      }

      const url = conf.has('url') ? conf.get('url') : undefined
      if (url === undefined) {
        reportError(req, res, new Error(`Can't find authorization server`))
        return
      }

      const headers = {}
      headers["authorization"] =  access_token
      headers["client"] = "Blog"

      aq.rest(url,'GET' , headers)
        .then( data => {
          const pass = (data) ? data.pass: undefined
          if (pass === undefined)
            reportError(res, req, new Error('can\'t get expected value from response'))
          else if (pass === 0) reportError(res, req, new Error('check access_token failed'))
          else next()
        })
        .catch(err => reportError(res, req, new Error(`Unknown issue get from authorization server, details: ${err.message}`)))
    })
  }
