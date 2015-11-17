{
  "version": "2.0.0",
  "arguments": {"postid": "string"},
  "parts":
  [{
    "headers": (ctx) => {
      return {
        "options": {
          "filter": {"_id": ctx.args.postid}
        }
      }},
    "parts":[{
      "before": (ctx, data) => {

        let post = data[0]

        ctx.global.post = post
        ctx.global.userToken = (post) ? post.publishedBy : ''
      },
      "headers": (ctx) => {

        return {
          "name": "user",
          "options": {
            "filter": {"userToken": ctx.global.userToken}
          }
        }},
    }]
  }],
  "after": (ctx, data) => {
    const user = data
    let post = JSON.parse(JSON.stringify(ctx.global.post))

    if (user && user.userToken)
      post.author = {"_id":user._id, "userToken":user.userToken, "nick":user.nick, "email": user.email}
    else post.author = {"_id":'', "userToken":'', "nick":'', "email": ''}

    return post
  }
}
