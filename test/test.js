'use strict'

/*
const RBAC = require('../src/rest/wrapper/rbac.js')

const rbac = new RBAC()

const wrapper = rbac['user']
//console.log(JSON.stringify(converter))

console.log(typeof converter)

Object.keys(wrapper())
  .forEach( k => console.log(k))

console.log(rbac['user']().to({"password": "12345"}))
*/

const wrappers = require('../src/rest/wrapper/')
const user = wrappers.get('user')
console.log(wrappers)
