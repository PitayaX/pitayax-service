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
    const keys = []
    const args = ctx.args

    data.map( row => row.tags)
      .forEach( arr => {
        arr.forEach( key => {
          if (keys.length >= args.max) return
          if (keys.indexOf(key) === -1) keys.push(key)
        })
      })

    return keys.map( key => {return {"name": key}} )
  }
}
