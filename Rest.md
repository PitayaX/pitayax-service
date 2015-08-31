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
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
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
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
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

> Usage:

```javascript
request:
post:/api/customer/query
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{
  "$script": "query1",
  "$arguments": {
    "city": ["Aachen", "Nantes"]
  }
}

response:
[
    {
        "_id": "55d4410288dba04c68296724",
        "City": "Aachen",
        "Fax": "0241-059428",
        "PostalCode": "52066",
        "ContactTitle": "Order Administrator",
        "Phone": "0241-039123",
        "ContactName": "Sven Ottlieb",
        "CustomerID": "DRACD",
        "Country": "Germany",
        "CompanyName": "Drachenblut Delikatessen",
        "Region": null,
        "Address": "Walserweg 21"
    },
    {
        "_id": "55d4410288dba04c68296725",
        "City": "Nantes",
        "Fax": "40.67.89.89",
        "PostalCode": "44000",
        "ContactTitle": "Owner",
        "Phone": "40.67.88.88",
        "ContactName": "Janine Labrune",
        "CustomerID": "DUMON",
        "Country": "France",
        "CompanyName": "Du monde entier",
        "Region": null,
        "Address": "67, rue des Cinquante Otages"
    },
    {
        "_id": "55d4410288dba04c6829672d",
        "City": "Nantes",
        "Fax": "40.32.21.20",
        "PostalCode": "44000",
        "ContactTitle": "Marketing Manager",
        "Phone": "40.32.21.21",
        "ContactName": "Carine Schmitt",
        "CustomerID": "FRANR",
        "Country": "France",
        "CompanyName": "France restauration",
        "Region": null,
        "Address": "54, rue Royale"
    }
]

query1.js saved in scripts/perdefine/customer folder
var $$ = {
        "type":"report",
        "version":"1.0.0",
        "arguments":{
          "$$city":{
            "default":["London","Tsawassen"], "type":"string"
          }
        },
        "script":{
           "$query":{"City": {"$in": "$$city"}},
           "$page":1,
           "$pageSize":3,
           "$sort": {"Fax":1}
        }
    };
```

##Insert
| | |
|---|---|
|URL|/api/object/insert|
|HTTP method|POST|
|Description | empty |

> Usage:

```javascript
request:
post:/api/customer/insert
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{
        "City": "Aachen2",
        "Fax": "0241-059428",
        "PostalCode": "52066",
        "ContactTitle": "Order Administrator",
        "Phone": "0241-039123",
        "ContactName": "Sven Ottlieb",
        "CustomerID": "DRACD",
        "Country": "Germany",
        "CompanyName": "Drachenblut Delikatessen",
        "Region": null,
        "Address": "Walserweg 21"
}

response:
{
    "__v": 0,
    "City": "Aachen2",
    "Fax": "0241-059428",
    "PostalCode": "52066",
    "ContactTitle": "Order Administrator",
    "Phone": "0241-039123",
    "ContactName": "Sven Ottlieb",
    "CustomerID": "DRACD",
    "Country": "Germany",
    "CompanyName": "Drachenblut Delikatessen",
    "Region": null,
    "Address": "Walserweg 21",
    "_id": "55e4635f79c517e800d59cca"
}
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
