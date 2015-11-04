{
  "version": "2.0.0",
  //"action": "mongo",
  "parts": {
    "headers": {"options":{"fields": ["tags"]}}
  },
  "after": (ctx, data) => {
    let keys = []

    data.map( row => row.tags)
      .forEach( arr => {
        arr.forEach( key => {
          if (keys.indexOf(key) === -1) keys.push(key)
        })
      })

    return keys
  }
}
