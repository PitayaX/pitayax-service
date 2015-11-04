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

      //get path map for current method
      const pathMap = conf.get(httpMethod)

      //fetch every path in map
      for(let path of pathMap.keys()) {

        //create method for current path
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

            //write ready info to log
            logger.verbose(`ready for execute ${adpaterMethod}.`, `${adapter.name} rest`)

            //bind method to function
            const bindMethod = method.bind(adapter, req, res)

            //invoke method
            bindMethod()
              .then( data => {
                //callback with return data
                callback(req, res, null, data, app)

                //write finish info to log
                logger.verbose(`execute ${adpaterMethod} finished.`, `${adapter.name} rest`)
              })
              .catch( err => {

                //write error to log
                logger.error(`execute ${adpaterMethod} faield, details: ${(err) ? err.message : ''}.`, `${adapter.name} rest`)

                //callback with error
                callback(req, res, err, null, app)
              } )
          }
          catch(err) {

            //set status code for error
            if (err && !err.statusCode) err.statusCode = 400

            //callback with error
            callback(req, res, err, null, app)
          }
        }

        //bind method to router by path
        restRouter[httpMethod](path, methodByPath)
      }
    }

    //restRouter.all('*', (req, res) => that.callback(req, res, new Error('Invaild path'), null))

    return restRouter
  }
}

module.exports = RestRouter
