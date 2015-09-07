## Retrieve
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/object-id</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>GET</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>get single instance of object</td>
    </tr>
    </tbody>
</table>

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

## Query
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/query</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>get array of objects by matched query criterion</td>
    </tr>
    </tbody>
</table>


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


## Create
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/create</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td> Create new object by json body</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
post:/api/customer/create
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

## Update
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/object-id</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>PUT</td>
    </tr>
    <tr>
        <td>Description</td>
        <td> Update one object by its object-id</td>
    </tr>
    </tbody>
</table>

> Usage:

```javascript
request:
put:/api/customer/55e4635f79c517e800d59cca
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{
  "City": "AachenXX2"
}

response:
{
    "ok": 1,
    "nModified": 1,
    "n": 1
}
```

## Delete
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/object-id</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>DELETE</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>Delete one object by its object-id</td>
    </tr>
    </tbody>
</table>

> Usage:

```javascript
request:
delete:/api/customer/55e4635f79c517e800d59cca
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{}

response:
{
    "ok": 1,
    "n": 1
}
```

## Script
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/api/object/script/script-name</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>execute pre-defined script in server, it doesn't only work for query, also can work for batch update/delete</td>
    </tr>
    </tbody>
</table>

> Usage:

```javascript
request:
post:/api/customer/script/query1
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{
  "city": ["Aachen", "Nantes"]
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
{
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
