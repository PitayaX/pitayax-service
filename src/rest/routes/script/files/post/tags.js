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

    const map = new Map()

    data.map( row => row.tags )
      .reduce( (arr, tags) => {
        if (!arr) arr = []    //create new array if array wasn't defined

        if (!Array.isArray(tags)) cur = [tags] //re-create array if current is not array

        //get tag
        tags.forEach( tag => {
                      tag.split(',')  //use comma to split tag
                        .forEach( key => {
                          if (key) arr.push(key.trim()) //remove space and append key to array
                        })
                    })

        return arr
      })
      .forEach( key => map.set(key, map.has(key) ? (map.get(key) + 1) : 1) )

    //get const from context
    const args = ctx.args

    return Array.from(map.entries())    //convert mapping to array
      .sort( (a, b) => b[1] - a[1] )    //sort by count of key
      .splice(0, args.max)              //limit return record by max argument
      .map( item => {
        return {"name":item[0], "count":item[1]}  //return array to object
      })
  }
}
