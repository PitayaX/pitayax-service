'use strict'

const fs = require('fs')
const path = require('path')
const aq = require('pitayax-service-core').aq
const gq = require('pitayax-service-core').gq

const Parser = gq.Parser
const Engine = gq.Engine

class ScriptAdapter
{
  constructor(app)
  {
    this._app = app
    this._conf = app.parseConf('/rest/routes/script/conf.yaml').toObject()
  }

  test(req, res)
  {
    return aq.Q('test')
  }

  call(req, res)
  {
    //generate arguments for current script
    const args = this._getArguments(req)

    //create engine and execute
    return this._createEngine(req)
            .then( engine => engine.execute(args) )
  }

  _getArguments(req)
  {
    return req.query
  }

  _createEngine(req)
  {
    const that = this
    const app = that._app
    const conf = that._conf

    const notFound = function() {
      let err = new Error('Can\'t find script by path')
      err.statusCode = 404

      throw err
    }

    let getPath = req.path
    if (getPath.startsWith('/')) getPath = getPath.substring(1, getPath.length)
    if (getPath.endsWith('/')) getPath = getPath.substring(0, getPath.length - 1)

    const paths = getPath.split('/')

    //invaild request path, ignore
    if (paths.length === 0 || paths.length > 2) notFuond()

    let name = undefined
    let scriptFile = `${paths[paths.length - 1]}.js`

    if (paths.length == 2) {
      name = paths[0]
      scriptFile = `${paths[0]}\\${scriptFile}`
    }

    //get full path of script file
    scriptFile = path.join(global.dir, `rest\\scripts\\${scriptFile}`)

    //check file exists or not
    try {fs.statSync(scriptFile)}
    catch(err) { notFound() }

    //create new instance of parser
    const parser = new Parser()

    return parser.parseFile(scriptFile)
            .then( script => {

              const engine = new Engine(script)

              //set data adapters for data engine
              if (app.adapters) {
                for(let type of app.adapters.keys()) {
                  engine.setDataAdapter(type, app.adapters.get(type))
                }
              }

              //engine.setDataAdapter('mongo', that._dbAdapter)
              //set context items for data engine
              engine.setContextItem('req', req || {})
              engine.setContextItem('conf', conf || {})
              engine.setContextItem('name', name || '')

              engine.DefaultAction = 'mongo'

              return engine
            })
            .catch( err => {
              err.statusCode = 500
              throw err
            })
  }
}

module.exports = ScriptAdapter
