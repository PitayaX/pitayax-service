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
  content-type: "multipart/form-data"
}
Requestpayload:{

}

response:
headers:{}
body:{
[
  {
    file-token:"xxxx", //you can use 7niu hash to repalce
    file-name: "xxx.jpg",
    content-type: "image/jpeg"
    size: 412
  }
  ...
]}
```
---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/fs/file-token</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>GET</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>download file</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
GET:/fs/file-token
headers:{
  content-type:""
  access-token:""
}
response:
headers:{
	content-type:"",
	filename:"",
	(width=, height=) if it is a image
	size:""
}
body: binary

```

---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/fs/file-token</td>
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
delete:/fs/file-token
header: {
  content-type: "application/json"
  access-token:""
}
body: {}
```

---

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
```

---

<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/picture/upload</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>upload a picture</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
post:/picture/upload
headers:{
  content-type: "multipart/form-data"
}
Request Payload:{
------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="mode"

1
------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="height"

100
------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="width"

200
------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="file"; filename="realFileName1.jpg"
Content-Type: image/jpeg


------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="file"; filename="realFileName2.jpg"
Content-Type: image/jpeg


------WebKitFormBoundary3hhSVxzTfNofdvnO--
}

response:
  [
    { "hash":"xxxxxx",
      "key":"maskFileName.jpg",
      "filename":"realFileName.jpg",
      "url":"xxxxxxxx"},

    { "hash":"xxxxxx",
      "key":"maskFileName.jpg",
      "filename":"realFileName.jpg",
      "url":"xxxxxxxx"},

    ......
  ]
```
