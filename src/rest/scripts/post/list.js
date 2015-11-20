{
  "version": "2.0.0",
  "parts":
  {
    "id": "posts",
    "body": (ctx) => ctx.req.body,
    "parts":
    {
      "id": "users",
      "headers": {"name": "user"},
      /* "relation": {
        "posts": {
          "joins": [{"publishedBy":"userToken"}],
          "as":{"name": "author", "fields": ["_id", "userToken", "nick", "email"]}
        }
      }, */
      "body": (ctx, data) =>
      {
        let userTokens = data
                      .map( post => post.publishedBy )
                      .filter( token => (token) ? true : false)
        userTokens = userTokens   //remove dupliction keys
                      .filter( (token, pos) => userTokens.indexOf(token) === pos )

        return {
          "query": {"userToken": {"$in": userTokens}}
        }
      },
    }
  },
  "after": (ctx, data) => {
    const posts = ctx.global.getItem('posts')

    const users = ctx.global.getItem('users')

    for( let i = 0; i < posts.length; i++ )
    {
      const post = posts[i]

      let user = users
                  .filter( user => user.userToken === post.publishedBy)
      user = (user.length > 0) ? user[0] : undefined

      if (user !== undefined)
        post.author = {"_id":user._id, "userToken":user.userToken, "nick":user.nick, "email": user.email}
      else post.author = {"_id":'', "userToken":'', "nick":'', "email": ''}
    }

    return posts
  }
}
