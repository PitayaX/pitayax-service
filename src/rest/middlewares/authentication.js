'use strict'

const path = require('path')
const aq = require('pitayax-service-core').aq

class Errors
{
  static get(name, err) {

    const error = new Error()

    error.code = -1
    switch(name) {
      case 'token':
        error.message = 'can\'t find token in request'
        break
      case 'url':
        error.message = 'can\'t find url of remote server'
        break
      case 'server':
        error.message = `connect to server failed, details: ${(err) ? err.message : 'unknown'}`
        break
      case 'result':
        error.code = -2
        error.message = 'can\'t get correct result from server, please check it again'
        break
      case 'deny':
        error.code = -2
        error.message = 'current token expired or invaild'
        break
      default:
        error.message = `unknown issue occured, details:${(err) ? err.message : 'unknown'}`
        break
    }

    return error
  }
}

module.exports = function(app, conf) {

    if (conf === undefined) {
      conf = app.parseConf(path.join(__dirname, 'authConf.yaml'))
    }

    const reportError = (err, res) => {

      if (!err) return

      //write error to logger
      app.logger.error(`Authorization failed, details: ${(err) ? err.message : 'unknown'}`, app.appName)

      //return error response
      if (app.reportError) app.reportError(err, res)
      else res.end(JOSN.stringify(err, null, 2))
    }

    app.use(
      (req, res, next) => {

        //output log to request
        app.logger.verbose(`Start to check permission for url: ${req.path} by http method: ${req.method}`, app.appName)

        const ignore = conf.has('ignore') ? conf.get('ignore') : false
        if (ignore) {

          app.logger.verbose('ignore', app.appName)
          next()
          return
        }

        try{
          //check access token
          const access_token = req.headers['access_token']
          if (access_token === undefined) throw Errors.get('token')

          //check yrl of remote server
          const url = conf.has('url') ? conf.get('url') : undefined
          if (url === undefined) throw Errors.get('url')

          //verify access token from remote server
          aq.rest(url, 'GET', {"authorization": access_token, "client": "pitayax-web"})
            .then( data => (data) ? data.pass: undefined )
            .then( data => {

              //parse result
              if (data === undefined) throw Errors.get('result')  //get invalid data
              if (data === 0) throw Errors.get('deny')    //reject your access

              next()
            } )
            .catch( err => reportError((err.code && err.code == -2) ? err : Errors.get('server', err), res) )
        }
        catch(err) {
          reportError(err, res)
        }
    })
  }
