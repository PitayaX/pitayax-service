'use strict'

let aq = require('pitayax-service-core').aq

class AdminAdapter
{
  constructor(app)
  {
    this.app = app
  }

  test(req, res)
  {
    return aq.Q('test')
  }

  list(req, res)
  {
    return aq.Q('undefined')
  }

  sendmail(req, res)
  {
    return aq.Q('undefined')
  }
}

module.exports = AdminAdapter
