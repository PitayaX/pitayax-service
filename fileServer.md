## FileServer API Preview

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>upload a file</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
post:/
headers:{
  content-type: "multipart/form-data"
}
Requestpayload:{

}

response:
headers:{}
body:{
[
  {
    file-hash:"FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
    file-name:"Chrysanthemum.jpg",
    file-token:"upload_e06985deed637cfaae00aef272be4e18.jpg",
    content-type:"image/jpeg",
    size:879394
  }
  ...
]}
```
---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/info/{file-hash}</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>GET</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>Get file infomation</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
GET:/info/{file-hash}
headers:{
  content-type:""
  access-token:""
}

response:
headers:{}
body: {
  file-hash:"FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
  file-token:"e06985deed637cfaae00aef272be4e18.jpg",
  content-type:"image/jpeg",
  putTime:14423676387026204,
  size:879394
}

```
---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/{file-hash}</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>GET</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>download a file</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
GET:/{file-token}
headers:{
  height(option):"100",
  width(option):"200",
  mode(option):"1"
}

response:
headers:{}
body: {
  file-hash:"FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
	file-token:"34c417a888b253e2282aff0214430b68.jpg",
  content-type:"image/jpeg",
  putTime:14423676387026204,
  size:879394,
  file-url:"http://{bucketUrl}/{mask-name}?e={deadline}&token={token}"
}

```

---

<table>
    <tbody>
    <tr>
        <td>URL</td>
      <td>/{file-hash}</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>delete</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>delete a file</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
delete:/{file-hash}
header: {
  content-type: "application/json"
  access-token:""
}
body: {
  ok:1 Or 0  
}
```
