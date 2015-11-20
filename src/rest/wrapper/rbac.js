'use strict'

const crypto = require('crypto')
const hashs = ['sha384', 'md5', 'sha256']

const conf = global.parseConf('/rest/wrapper/conf.yaml')

const generateHash = (data, algorithm, digest) => {
  const
    hash = crypto.createHash(algorithm)
    hash.update(data)
  return hash.digest(digest)
}

const hashPass = (password) => {

  const passConf = conf.get('password')

  let hashs = passConf.get('hash')
  if (!Array.isArray(hashs)) hashs= [hashs]

  const digest = passConf.get('digest')

  for ( let i = 0; i < hashs.length; i++)
  {
    password = generateHash(password, hashs[i], digest)
  }

  //return password
  return password
}

const wrapper = {
  "sys.user": {
    "to": user => {
      if (user.password !== undefined)
        user.password = hashPass(user.password)
      return user
    },

    "from": user => {
      //if (user.password !== undefined)
        //user.password = '******'
      return user
    }
  }
}

module.exports = wrapper
