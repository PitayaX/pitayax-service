'use strict'

const hashPass = password => {
  //return password
  return 'hashed'
}

const wrapper = {
  "sys.user": {
    "to": user => {
      if (user.password !== undefined)
        user.password = hashPass(user.password)
      return user
    },

    "from": user => {
      if (user.password !== undefined)
        user.password = '******'
      return user
    }
  }
}

module.exports = wrapper
