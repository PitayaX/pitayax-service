'use strict'

const aq = require('pitayax-service-core').aq

class ApiAdapter
{
  constructor(app, key)
  {
    this._app = app
    this._key = key
    this.name = 'api'
  }

  _getName() {
    return (this) ? this._key : ''
  }

  _getType()
  {
    return 'mongo'
  }

  _getAdapter()
  {
    const app = this._app

    if (app.adapters) {
      const type = this._getType()
      if (app.adapters.has(type)) return app.adapters.get(type)
    }

    throw new Error('can\'t found data adapter')
  }

  //test method, retrun a static value. only used for test
  test(req, res)
  {
    return aq.Q('test')
  }


  model(req, res)
  {
    const app = this._app
    const connections = app.connections

    const name = this._getName()
    const schemas = (connections.Schemas) ? connections.Schemas : new LeepMap()

    return aq.Q((schemas.has(name)) ? schemas.get(name).model : {})
  }

  //create new object with body
  create(req, res)
  {
    //get body and try to parse from request
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    //get data adapter
    const adapter = this._getAdapter()

    //create object and return result
    return adapter.create(this._getName(), body)
  }

  //retrieve object by filter
  retrieve(req, res)
  {
    //get data adapter
    const adapter = this._getAdapter()

    //get filter from request
    const filter = this._getFilter(req, {})

    //retrieve object(s) by filter
    return adapter.retrieve(this._getName(), filter, {"method": "findOne"})
  }

  //update object with filter and modifier
  update(req, res)
  {
    //get body and try to parse from request
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    //get filter and modifier from request
    const filter = this._getFilter(req, body)
    const modifier = (body.modifier) ? body.modifier : body

    //get data adapter
    const adapter = this._getAdapter()

    //update object and return result
    return adapter.update(this._getName(), filter, modifier)
  }

  //delete object with filter
  delete(req, res)
  {
    //get filter from request
    const filter = this._getFilter(req)

    //get data adapter
    const adapter = this._getAdapter()

    //delete object and return result
    return adapter.delete(this._getName(), filter)
  }

  //list all objects
  list(req, res)
  {
    //get data adapter
    const adapter = this._getAdapter()

    //retrieve all objects
    return adapter.retrieve(this._getName(), {}, {"method": "find"})
  }

  //get count of object by filter
  count(req, res)
  {
    //parse filter and options from request
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "count"

    //get data adapter
    const adapter = this._getAdapter()

    //get count of objects by filter
    return adapter.retrieve(this._getName(), filter, options)
  }

  //query objects by filter
  query(req, res)
  {
    //parse filter and options from request
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "find"

    //get data adapter
    const adapter = this._getAdapter()

    //retrieve objects by filter
    return adapter.retrieve(this._getName(), filter, options)
  }

  //get aggregate value by filter
  aggregate(req, res)
  {
    //parse filter and options from request
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "aggregate"

    //get data adapter
    const adapter = this._getAdapter()

    //aggregate objects by filter
    return adapter.retrieve(this._getName(), filter, options)
  }

  //disable method only used for test
  disable(req, res)
  {
    const
      err = new Error('deny access')
      err.statusCode = 403
      err.code = 403
    throw err
  }

  //pass method, donothing, only used for test
  pass(req, res)
  {
    //set response status
    res.statusCode = 200

    return aq.Q({"pass": 1})
  }

  _getFilter(req, body)
  {
    //check request
    if (!req) return {}

    //parse body from request
    if (body === undefined) body = (req.body) ? req.body : {}
    if (typeof body === 'string') body = JSON.parse(body)

    //get filter form body
    let filter = (body.query) ? body.query : body
    if (Object.keys(body).length > 0) return filter

    //get key and id value from request
    const key = (req.params["key"]) ? req.params["key"] : "_id"
    filter[key] = req.params["id"]

    //return filter
    return filter
  }

  _parseFilter(req)
  {
    //check request
    if (!req) return {}

    //get content type from request headers
    let ctype = req.header('content-type')
    const index = (ctype ? ctype : '').toLowerCase().indexOf('application/json')

    //can't find json mark in headers, reject query
    if (index === -1) {
      const
        err = new Error('invaild request body, rejected.')
        err.code = 403
        err.statusCode = 403
        throw err
    }

    //process body
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    //parse query in body
    if (body.query) return body.query
    else if (body.filter) return body.filter
    //else if (body['$query']) return body['$query']
    else return body
  }

  _parseOptions(req)
  {
    //check request
    if (!req) return {}

    //process body
    let body = (req.body) ? req.body : {}
    if (typeof body === 'string') body = JSON.parse(body)

    //create new object for options
    const options = {}

    //parse fields
    let fields = (body.fields) ? body.fields : undefined
    if (fields === undefined) fields = {}
    if (fields !== undefined) options.fields = fields

    //parse sort and pager
    if (body.sort) options.sort = body.sort
    if (body.page) options.page = body.page
    if (body.pageSize) options.pageSize = body.pageSize

    //return options
    return options
  }
}

module.exports = ApiAdapter
