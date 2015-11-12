{
  "version": "2.0.0",
  "arguments": {
    "max": {
      "type": "number",
      "default": 5
    }
  },
  //"action": "mongo",
  "parts": {"headers": {"options":{"fields": ["tags"]}}},
  "after": (ctx, data) => {

    //const keys = []
    const args = ctx.args
    const allKeys = []
    console.log('b1')

    const append = (a, b) => {
      if (!a) a = []
      if(b) a.push(b.trim())
    }

    //get all key from tag
    data.map( row => row.tags )
          .forEach( arr => {
            arr.forEach( key => {
              if (key === '') return
              if (key.indexOf(',') === -1)
                allKeys.push(key)
              else {
                key.split(',').forEach( skey => allKeys.push(skey.trim()))
              }
            })
          })

    //calculate count of keys
    const keys = new Map()
    allKeys.forEach(key => {
      if (keys.has(key))
        keys.set(key, keys.get(key) + 1)
      else keys.set(key, 1)
    })

    return Array.from(keys.entries())
      .sort((a, b) => b[1] - a[1])
      .splice(0, args.max)
      .map( item => {return {"name":item[0], "count":item[1]}})
  }
}
