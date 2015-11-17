'use strict'

class RBAC
{
  constructor(app)
  {
    this._app = app
  }

  _hash()
  {
  }

  user()
  {
    const that = this

    return {
      to: user => {
        user.password = 'hashed'
        return user
      },

      from: user => {
        user.password = 'encrypted'
        return user
      }
    }
  }
}

module.exports = RBAC
