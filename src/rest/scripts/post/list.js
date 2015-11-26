{
  "version": "2.0.0",
  "parts":
  {
    "id": "posts",
    "body": (ctx) => ctx.req.body,
    "relations": {
      "target": "user",
      "joins": { "publishedBy":"userId" },
      "as":{ "name": "author", "fields": ["_id", "userId", "nick", "email"] }
    }
  }
}
