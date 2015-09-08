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
------WebKitFormBoundaryE4zkjTAIwCB1OmBC
Content-Disposition: form-data; name="width"

600
------WebKitFormBoundaryE4zkjTAIwCB1OmBC
Content-Disposition: form-data; name="xxxx"; filename="xxxxx"
Content-Type: image/jpeg


------WebKitFormBoundaryE4zkjTAIwCB1OmBC--
}

response: {
  {
    "hash":"xxxxxx",
    "key":"xxxxxx.jpg",
    "url":"xxxxxxxx"}
}
```
