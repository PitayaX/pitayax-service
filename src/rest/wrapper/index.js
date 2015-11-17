'use strict'

module.exports = function(app) {

  //parse configuration file
  const conf = app.parseConf('/rest/wrapper/conf.yaml')

  //get definition files
  const files = conf.get('files')

  //create new Map for warppers
  const wrappers = new Map()

  //fetch every definition file
  for(let i = 0; i < files.length; i++)
  {
    //get instance
    const obj = require(files[i])

    Object.keys(obj)
      .filter( key => {
        const target = obj[key]

        return (target && typeof target.to === 'function' && typeof target.from === 'function')
      })
      .forEach(key => wrappers.set(key, obj[key]))
  }

  //return
  return wrappers
}
