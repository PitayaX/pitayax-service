{
  "version": "2.0.0",
  "arguments": {"postid": "string"},
  "parts":
  {
    "id": "post",
    "headers": {"method": "retrieveOne"},
    "body": (ctx) => {return {"_id": ctx.args.postid}},

    "parts":
    [
      {
        "#":"get author info for current post",
        "id": "user",
        "headers": {"name": "user", "method": "retrieveOne"},
        "body": (ctx, data) => {return {"userToken":  (data) ? data.publishedBy : ''}}
      }
    ]
  },
  "after": (ctx, data) => {

    const post = ctx.global.getItem('post')
    const user = ctx.global.getItem('user')

    if (user && user.userToken)
      post.author = {"_id":user._id, "userToken":user.userToken, "nick":user.nick, "email": user.email}
    else post.author = {"_id":'', "userToken":'', "nick":'', "email": ''}

    return post
  }
}
