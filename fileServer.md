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
------WebKitFormBoundary3hhSVxzTfNofdvnO
Content-Disposition: form-data; name="mode" * [Picture Mode](http://developer.qiniu.com/docs/v6/api/reference/fop/image/imageview2.html#imageView2-specification)

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
