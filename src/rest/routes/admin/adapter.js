'use strict'

const ConfigMap = require('pitayax-service-core').ConfigMap
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
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

  list(req, res)
  {
    const app = this.app
    const connections = app.connections

    const keys = []
    for (let key of connections.Schemas.keys()){
      keys.push(key)
    }

    return aq.Q(keys)
  }

  sendmail(req, res)
  {
    //get application
    const app = this.app

    //parse configruation file
    const conf = (this.conf.mail) ? this.conf.mail : {}

    //create transporter with SMTP server
    const transporter = nodemailer.createTransport(smtpPool(conf["smtp"]))

    try {
      //create options for send content
      let options = (req.body) ? req.body : {}
      if (typeof options === 'string') options = JSON.parse(options)

      //use default from address if it doesn't exist in request body
      if (!options.from) options.from = conf.from

      //send mail with options
      transporter.sendMail(options)

      app.logger.verbose(`sent mail, options: ${JSON.stringify(options)}`, app.appName)

      //return result
      return aq.Q('OK')
    }
    finally {

      //close transporter
      transporter.close();
    }
  }
}

module.exports = AdminAdapter
