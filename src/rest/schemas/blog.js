{
  "database":
  {
    "default": "blog"
  },
  "entity":
  {
    "post":
    {
      "model":
      {
        "title": "String",
        "abstract": "String",
        "content": "String",
        "tags": [],
        "publishedOn": { "type": "Date", "default": Date.now() },
        "publishedBy": "String",
        "status": "Number",
        "viewCount": "Number",
        "likeCount": "Number",
        "CanComment": "Boolean"
      },
      "options": { "collection": "post" }
    },
    "user":
    {
      "model":
      {
        "userId": { "type": "String" },
        "nick": "String",
        "email": "String",
        "avatarFileToken": "String",
        "phone": "String",
        "description": "String",
        "homepage": "String",
        "gender": "Number",
        "birthday": "Date",
        "createdOn": "Date",
        "updatedOn": "Date"
      },
      "options": { "collection": "user" }
    },
    "team":
    {
      "model":
      {
        "nick": "String",
        "email": "String",
        "avatarFileToken": "String",
        "phone": "String",
        "description": "String",
        "homepage": "String",
        "users": [{ "userToken": "String", "role": "String" }]
      },
      "options": { "collection": "team" }
    }
  }
}
