'use strict'

const path = require('path')
const ConfigMap = require('pitayax-service-core').ConfigMap
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const aq = require('pitayax-service-core').aq

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
    const conf = this.app
                    .parseConf(path.join(__dirname, 'mailConfig.yaml'))
                    .toObject()

    const transporter = nodemailer.createTransport(smtpPool(conf["SMTP"]))

    try {
      let options = (req.body) ? req.body : {}
      if (typeof options === 'string') options = JSON.parse(options)

      //use default from address if it doesn't exist in request body
      if (!options.from) options.from = conf.from

      //send mail with options
      transporter.sendMail(options)

      return aq.Q('OK')
    }
    catch(err) {
      return aq.Q(null, err)
    }
    finally {
      console.log('closed')
      transporter.close();
    }
  }
}

module.exports = AdminAdapter
