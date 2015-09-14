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
    file-name: "Chrysanthemum.jpg",
    mask-name:"upload_d39211e749807247cdb78bd1d742bf32.jpg",
    content-type: "image/jpeg"
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
	mask-name:"upload_34c417a888b253e2282aff0214430b68.jpg",
  content-type:"image/jpeg",
	putTime:14421992628553554,
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
GET:/file-token
headers:{
  height:"100",
  width:"200",
  mode:"1"
}

response:
headers:{}
body: {
  file-hash:"FvX4rSaBmkcTGNJGMfpQVQNnEqh-",
	mask-name:"upload_34c417a888b253e2282aff0214430b68.jpg",
  content-type:"image/jpeg",
  file-url:"http://{bucketUrl}/{mask-name}?e={deadline}&token={token}",
	putTime:14421992628553554,
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
body: {}
```

<!-- ---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/fs</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>delete</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>delete files</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
delete:/fs
header: {
  content-type: "application/json"
  access-token:""
}
body: {
  file-tokens: [token1, token2 ... tokenn]
}

response:
body:{
  "ok":1, (failed is 0)
  "n":1 (the count of deleted files)
}
``` -->
