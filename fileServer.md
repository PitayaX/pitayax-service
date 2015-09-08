## FileServer
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
------WebKitFormBoundaryDwYRyOW5xtTxZ5gl
Content-Disposition: form-data; name="width"

100
------WebKitFormBoundaryDwYRyOW5xtTxZ5gl
Content-Disposition: form-data; name="xxxx"; filename="xxxx.jpg"
Content-Type: image/jpeg


------WebKitFormBoundaryDwYRyOW5xtTxZ5gl
Content-Disposition: form-data; name="xxxx"; filename="xxxx.jpg"
Content-Type: image/jpeg


------WebKitFormBoundaryDwYRyOW5xtTxZ5gl--
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
