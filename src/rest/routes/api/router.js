'use strict'

const Router = require('../restRouter.js')
const Adapter = require('./adapter.js')

class ApiRouter extends Router
{
  constructor(app)
  {
    super(app)
  }

  createRouter(conf, adapter, callback)
  {
    if (this.app === undefined) return that.newRouter()

    //assign this to that
    const that = this

    //get application from adapter
    const app = (that.app) ? that.app : undefined

    //create new router for api
    const router = that.newRouter()

    //get connections from application
    const schemas = (app.connections) ? app.connections.Schemas : undefined

    if (schemas) {

      //fetch every item in schemas
      for(let key of schemas.keys()) {

        //create item router by name
        router.use(
          `/${key}`,
          super.createRouter(conf, new Adapter(app, key), callback)
        )
      }
    }

    //catch unhandle path
    router.use(
      '*',
      (req, res, next) => {

        const
          err = new Error(`invaild path: ${req.originalUrl} for current router.`)
          err.statusCode = 404

        //output error
        callback(req, res, err, null, app)
      }
    )

    return router
  }
}

module.exports = ApiRouter
