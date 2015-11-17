'use strict'

class RestRouter
{
  constructor()
  {
  }

  createRouter(app, conf, adapter, callback)
  {
    //create rest router
    const restRouter = app.newRouter()

    //get instance of logger
    const logger = app.logger

    //fetch all methods defined in configuration
    for (let httpMethod of conf.keys()) {

      //output message to logger
      logger.verbose(`start to create router for http methods: ${httpMethod}`, app.appName)

      //get path map for current method
      const pathMap = conf.get(httpMethod)

      //fetch every path in map
      for (let path of pathMap.keys()) {

        //output message to logger
        logger.verbose(`create router by path:${path}`, app.appName)

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
              throw new Error(`invalid method: ${adpaterMethod} in adapter`)
            }

            //write ready info to log
            logger.verbose(`ready for execute ${adpaterMethod}.`, app.appName)

            //bind method to function
            const bindMethod = method.bind(adapter, req, res)

            //invoke method
            bindMethod()
              .then( data => {
                //callback with return data
                callback(req, res, null, data, app)

                //write finish info to log
                logger.verbose(`execute ${adpaterMethod} finished.`, app.appName)
              })
              .catch( err => {

                //write error to log
                logger.error(`execute ${adpaterMethod} faield, details: ${(err) ? err.message : ''}.`, app.appName)

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

        //output message to logger
        logger.verbose('created rest router finished', app.appName)
      }
    }

    return restRouter
  }
}

module.exports = RestRouter
