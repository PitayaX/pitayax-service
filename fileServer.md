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
  filename: "haok.jpg",
  content-type: "multipart/form-data" or "image/jpeg" {file type} and so on,
  content-length: 832568
}
Requestpayload:{
  fileData
}

response:
headers:{}
body:
  {
  	"file-hash":"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  	"file-token":"8d5699ca2b85943219b798b4ae2c2c128edb63432ef6d3cada0113d3e466a671f2448a1d7e551a19a597110d24988b3ca197fe0edb870630a4cdcf916f140cec239b9bf377a9a76d705ba0f7395e7046",
  	"file-name":"haok.jpg",
  	"content-type":"image/jpeg",
  	"size":"832568"
  }
```
---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/fs/{file-token}</td>
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
  file-hash:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-token:"8d5699ca2b85943219b798b4ae2c2c128edb63432ef6d3cada0113d3e466a671f2448a1d7e551a19a597110d24988b3c049cb51dc7f8713078c774c1d0dfba620fd6e6519d5fb3849465b764435c7233",
  file-name:"haok.jpg",
  content-type:"image/jpeg",
  putTime:14428257101982782,
  size:832568,
  file-url:"http://{bucketUrl}/{mask-name}?e={deadline}&token={token}"
}

```

---

<table>
    <tbody>
    <tr>
        <td>URL</td>
      <td>/fs/{file-token}</td>
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
delete:/fs/{file-token}
header: {
  content-type: "application/json"
  access-token:""
}
body: {
  ok:1 Or 0  
}
```
