'use strict'

const ConfigMap = require('pitayax-service-core').ConfigMap
const aq = require('pitayax-service-core').aq

class AdminAdapter
{
  constructor(app)
  {
    this.app = app
    this.conf = app.parseConf('/rest/routes/admin/conf.yaml').toObject()
  }

  test(req, res)
  {
    return aq.Q('test')
  }
}

module.exports = AdminAdapter
