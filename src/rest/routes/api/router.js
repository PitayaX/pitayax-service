'use strict'

const Router = require('../restRouter.js')

class ApiRouter extends Router
{
  constructor()
  {
    super()
  }

  createRouter(conf, adapter, callback)
  {
    console.log('created')
    const that = this
    const app = (adapter.app) ? adapter.app : undefined

    if (app === undefined) return null

    //get connections from application
    const connections = app.connections

    const apiRouter = require('express').Router()

    for(let name of connections.Schemas.keys()) {
      const itemRouter = super.createRouter(conf, adapter, callback)
      console.log(itemRouter)
      apiRouter.use(`/${name}`, itemRouter)
    }

    return apiRouter
  }
}

module.exports = ApiRouter
