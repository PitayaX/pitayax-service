##Get
| | |
|---|---|
|URL|/api/object/object-id|
|HTTP method|GET|
|Description | empty |

> Usage:

```
request:
url:/api/customer/55d4410288dba04c6829671d
header:{}
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
|Description | empty |

> Usage:
```
post url:/api/customer/query
header:{}
body:{p1:"v1", p2: "v2"}
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
