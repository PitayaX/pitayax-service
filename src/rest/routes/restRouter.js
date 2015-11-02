'use strict'

let Express = require('express')

class RestRouter
{
  constructor()
  {
  }

  createRouter(conf, adapter, callback)
  {
    let that = this
    let restRouter = require('express').Router()

    for(let httpMethod of conf.keys()) {

      //get
      let pathMap = conf.get(httpMethod)

      for(let path of pathMap.keys()) {

        let methodByPath = function(req, res) {

          try {
            //set target
            if (req.target === undefined) req.target = adapter.target

            //get method name from adapter by path
            let adpaterMethod = pathMap.get(path)
            if (adpaterMethod === undefined) {
              throw new Error(`Can't find method by path: ${path} from configruation file.`)
            }

            //get instance of method from adpater
            let method = adapter[adpaterMethod]
            if (method === undefined) {
              throw new Error(`invaild method: ${adpaterMethod} in adapter`)
            }

            let app = (adapter.app) ? adapter.app : {}
            if (app.logger) app.logger.verbose(`ready for execute ${adpaterMethod}.`, `${adapter.name} rest`)

            //invoke metho
            method(req, res)
                .then( data => {
                  callback(req, res, null, data)

                  if (app.logger) app.logger.verbose(`execute ${adpaterMethod} finished.`, `${adapter.name} rest`)
                })
                .catch( err => callback(req, res, err, null) )
          }
          catch(err) {
            callback(req, res, err, null)
          }
        }

        restRouter[httpMethod](path, methodByPath)
      }
    }

    return restRouter
  }
}

module.exports = RestRouter
