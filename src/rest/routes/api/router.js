'use strict'

const Router = require('../restRouter.js')
const Adapter = require('./adapter.js')

const errorForPath = (path) => {
  const
    err = new Error(`Can't find router for ${path}.`)
    err.code = 404
    err.statusCode = 404

  return err
}

class ApiRouter extends Router
{
  constructor()
  {
    super()
  }

  createRouter(app, conf, adapter, callback)
  {
    //get instance of logger
    const logger = app.logger

    //create new router for api
    const router = app.newRouter()

    //get connections from application
    const schemas = (app.connections) ? app.connections.Schemas : undefined

    //create router for every object in schemas
    if (schemas) {

      //fetch every item in schemas
      for (let key of schemas.keys()) {

        const entity = schemas.get(key)

        const options = (entity.options) ? entity.options : {}

        //ignore if current entity is disable rest service
        if (options.rest !== undefined && options.rest === false) continue

        //output message to logger
        logger.info(`start to create for object: ${key}`, app.appName)

        //create new adapter for object by key
        const adapter = new Adapter(app, key)

        //output message to logger
        logger.verbose(`created adapter for object: ${key}`, app.appName)

        //create bind for object router
        const routerBind = super.createRouter.bind(router, app, conf, adapter, callback)

        //output message to logger
        logger.verbose(`bind router for object: ${key}`, app.appName)

        //create item router by name
        router.use(`/${key}`, routerBind())

        if (entity.database) {
          router.use(`/${entity.database}.${key}`, routerBind())
        }

        //output message to logger
        logger.verbose(`created adapter for object: ${key}`, app.appName)
      }
    }

    //catch unhandle path
    router.use('*', (req, res, next) => callback(req, res, errorForPath(req.originalUrl), null, app))

    return router
  }
}

module.exports = ApiRouter
