'use strict'

const aq = require('pitayax-service-core').aq
const Data = require('pitayax-service-core').data

let dataAdapter = undefined

class ApiAdapter
{
  constructor(app, key)
  {
    this.app = app
    this.key = key
    this.name = 'api'

    if (dataAdapter === undefined) {
      dataAdapter = new Data.MongoDBAdapter(app.connections)
    }
  }

  getName() {
    return (this) ? this.key : ''
  }

  test(req, res)
  {
    return aq.Q('test')
  }

  model(req, res)
  {
    const app = this.app
    const connections = app.connections

    const name = this.getName()
    const schemas = (connections.Schemas) ? connections.Schemas : new LeepMap()

    return aq.Q((schemas.has(name)) ? schemas.get(name).model : {})
  }

  create(req, res)
  {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    return dataAdapter.create(this.getName(), body)
  }

  retrieve(req, res)
  {
    return dataAdapter.retrieve(this.getName(), this._getFilter(req, {}), {"method": "findOne"})
  }

  update(req, res)
  {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    const filter = this._getFilter(req, body)
    const modifier = (body.modifier) ? body.modifier : body

    return dataAdapter.update(this.getName(), filter, modifier)
  }

  delete(req, res)
  {
    const filter = this._getFilter(req)

    return dataAdapter.delete(this.getName(), filter)
  }

  list(req, res)
  {
    return dataAdapter.retrieve(this.getName(), {}, {"method": "find"})
  }

  count(req, res)
  {
    //parse filter and options
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "count"

    return dataAdapter.retrieve(this.getName(), filter, options)
  }

  query(req, res)
  {
    //parse filter and options
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "find"

    return dataAdapter.retrieve(this.getName(), filter, options)
  }

  aggregate(req, res)
  {
    //parse filter and options
    const filter = this._parseFilter(req)
    const options = this._parseOptions(req)

    //set method of option
    if (!options.method) options.method = "aggregate"

    return dataAdapter.retrieve(this.getName(), filter, options)
  }

  disable(req, res)
  {
    const
      err = new Error('deny access')
      err.statusCode = 403
      err.code = 403
    throw err
  }

  pass(req, res)
  {
    res.statusCode = 200

    return aq.Q({"pass": 1})
  }

  _getFilter(req, body)
  {
    //check request
    if (!req) return {}

    if (body === undefined) body = (req.body) ? req.body : {}
    if (typeof body === 'string') body = JSON.parse(body)

    let filter = (body.query) ? body.query : body
    if (Object.keys(body).length > 0) return filter

    //get key and id value from request
    const key = (req.params["key"]) ? req.params["key"] : "_id"
    filter[key] = req.params["id"]

    return filter
  }

  _parseFilter(req)
  {
    //check request
    if (!req) return {}

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
    //if (fileds === undefined) fields = body['$fields'] ? body['$fields'] : undefined
    //if (fields === undefined) fields = (req.query && req.query.id) ? {"_id": 1} : undefined
    if (fields === undefined) fields = {}
    if (fields !== undefined) options.fields = fields

    //parse sort and pager
    if (body.sort) options.sort = body.sort
    if (body.page) options.page = body.page
    if (body.pageSize) options.pageSize = body.pageSize
    //if (body['$sort']) options.sort = body['$sort']
    //if (body['$page']) options.page = body['$page']
    //if (body['$pageSize']) options.pageSize = body['$pageSize']

    return options
  }
}

module.exports = ApiAdapter
