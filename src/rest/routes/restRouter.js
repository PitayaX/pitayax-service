'use strict'

let Express = require('express')

class RestRouter
{
  constructor(app)
  {
    this.app = app
  }

  newRouter()
  {
    return require('express').Router()
  }

  createRouter(conf, adapter, callback)
  {
    const that = this
    const restRouter = that.newRouter()
    const app = (that.app) ? that.app : ((adapter.app) ? adapter.app : {})
    const logger = app.logger

    for(let httpMethod of conf.keys()) {

      //get
      const pathMap = conf.get(httpMethod)

      for(let path of pathMap.keys()) {

        const methodByPath = function(req, res) {

          try {
            //get method name from adapter by path
            const adpaterMethod = pathMap.get(path)
            if (adpaterMethod === undefined) {
              throw new Error(`Can't find method by path: ${path} from configruation file.`)
            }

            //get instance of method from adpater
            const method = adapter[adpaterMethod]
            if (method === undefined) {
              throw new Error(`invaild method: ${adpaterMethod} in adapter`)
            }

            if (logger) {
              logger.verbose(`ready for execute ${adpaterMethod}.`, `${adapter.name} rest`)
            }

            const bindMethod = method.bind(adapter, req, res)

            //invoke metho
            bindMethod()
              .then( data => {
                callback(req, res, null, data, app)

                if (logger) {
                  logger.verbose(`execute ${adpaterMethod} finished.`, `${adapter.name} rest`)
                }
              })
              .catch( err => callback(req, res, err, null, app) )
          }
          catch(err) {

            if (err && !err.statusCode) err.statusCode = 500
            callback(req, res, err, null, app)
          }
        }

        restRouter[httpMethod](path, methodByPath)
      }
    }

    //restRouter.all('*', (req, res) => that.callback(req, res, new Error('Invaild path'), null))

    return restRouter
  }
}

module.exports = RestRouter
