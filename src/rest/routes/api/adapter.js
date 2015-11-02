'use strict'

let aq = require('pitayax-service-core').aq

class ApiAdapter
{
  constructor(app)
  {
    this.app = app
  }

  test(req, res)
  {
    return aq.Q('test')
  }
}

module.exports = ApiAdapter
