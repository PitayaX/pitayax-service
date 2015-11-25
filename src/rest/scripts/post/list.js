{
  "version": "2.0.0",
  "parts":
  {
    "id": "posts",
    "body": (ctx) => ctx.req.body,
    "relations": {
      "target": "user",
      "joins": { "publishedBy":"userToken" },
      "as":{ "name": "author", "fields": ["_id", "userToken", "nick", "email"] }
    }
  }
}
