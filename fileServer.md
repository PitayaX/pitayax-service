## FileServer API Preview

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/fs</td>
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
post:/fs
headers:{
  content-type: "multipart/form-data" or "image/jpeg" {file type} and so on
}
Requestpayload:{
  fileData
}

response:
headers:{}
body:{
[
  {
    file-hash:"qns001FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
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
        <td>/fs/{file-hash}</td>
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
GET:/fs/{file-token}
headers:{
  height(option):"100",
  width(option):"200",
  mode(option):"1"
}

response:
headers:{}
body: {
  file-hash:"qns001FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
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
      <td>/fs/{file-hash}</td>
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
delete:/fs/{file-hash}
header: {
  content-type: "application/json"
  access-token:""
}
body: {
  ok:1 Or 0  
}
```
