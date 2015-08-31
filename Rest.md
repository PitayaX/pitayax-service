##Get
| | |
|---|---|
|URL|/api/object/object-id|
|HTTP method|GET|
|Description | get single instance of object |

> Usage:

```javascript
request:
get:/api/customer/55d4410288dba04c6829671d
header:{access-token:xxxxxx}
body:{}

response:
{
    "_id": "55d4410288dba04c6829671d",
    "City": "Tsawassen",
    "Fax": "(604) 555-3745",
    "PostalCode": "T2F 8M4",
    "ContactTitle": "Accounting Manager",
    "Phone": "(604) 555-4729",
    "ContactName": "Elizabeth Lincoln",
    "CustomerID": "BOTTM",
    "Country": "Canada",
    "CompanyName": "Bottom-Dollar Markets",
    "Region": "BC",
    "Address": "23 Tsawassen Blvd."
}
```

##Query
| | |
|---|---|
|URL|/api/object/query|
|HTTP method|POST|
|Description | get array of objects by matched query criterion |

> Usage:

```javascript
request:
post:/api/customer/query
header:{access-token:xxxxxx}
body:{
  "$query":{"City":"London"},
  "$fields":{"City":1, "Fax":1, "CompanyName":1},
  "$page":1,
  "$pageSize":3,
  "$sort":{"CompanyName":1}
}

response:
[
    {
        "_id": "55d4410188dba04c68296717",
        "City": "London",
        "Fax": "(171) 555-6750",
        "CompanyName": "Around the Horn"
    },
    {
        "_id": "55d4410288dba04c6829671e",
        "City": "London",
        "Fax": null,
        "CompanyName": "B's Beverages"
    },
    {
        "_id": "55d4410288dba04c68296723",
        "City": "London",
        "Fax": "(171) 555-9199",
        "CompanyName": "Consolidated Holdings"
    }
]
```

##Insert
| | |
|---|---|
|URL|/api/object/insert|
|HTTP method|POST|
|Description | empty |

```
post url:/api/object/insert
header:{}
body:{p1:"v1", p2: "v2"}
```


##Update
| | |
|---|---|
|URL|/api/object/update|
|HTTP method|PUT|
|Body | `{p1:"v1", p2: "v2"}` |

##Delete
| | |
|---|---|
|URL|/api/object/delete|
|HTTP method|DELETE|
|Body | `{p1:"v1", p2: "v2"}` |
