{
  "database":
  {
    "default": "blog"
  },
  "entity":
  {
    "sys.user":
    {
      "model":
      {
        "uid": { "type": "String", "trim": true, "required": true },
        "name": { "type": "String", "trim": true, "required": true, "index": true },
        "password": "string",
        "email": { "type": "String" },
        "createdDate": { "type": "Date", "default": Date.now() },
        "modifiedDate": { "type": "Date", "default": Date.now() },
        "apiKey": "String",
        "accessToken": "String",
        "refreshToken": "String",
        "status": { "type":"Number", "default": 1, "min": 1, "max": 4 },
        "comment": "String"
      },
      "options": { "collection": "_user", "rest": false }
    },
    "sys.group":
    {
      "model":
      {
        "name": "String",
        "users": ["Schema.Types.ObjectId"]
      },
      "options": { "collection": "_group" }
    },
    "sys.role":
    {
      "model":
      {
        "name": "String",
        "type": "String",
        "items": ["String"]
      },
      "options": { "collection": "_role" }
    },
    "sys.permission":
    {
      "model":
      {
        "name": "String",
        "uri": "String",
        "action": "String",
        "script": "String",
        "allow": "Boolean"
      },
      "options": { "collection": "_permission" }
    },
    "sys.session":
    {
      "model":
      {
        "uid": "String",
        "token": {"type":"String", "index": { "unique": true }},
        "createdDateTime": { "type": "Date", "default": Date.now() },
        "updatedDateTime": { "type": "Date", "default": Date.now(), "index": { "expires": 300 } }
      },
      "options": { "collection": "_session", "rest": false }
    }
  }
}
