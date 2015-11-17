'use strict'

const RBAC = require('../src/rest/wrapper/rbac.js')

const rbac = new RBAC()

const converter = rbac['user']
//console.log(JSON.stringify(converter))

console.log(typeof converter)

Object.keys(converter())
  .forEach( k => console.log(k))

console.log(rbac['user']().to({"password": "12345"}))
