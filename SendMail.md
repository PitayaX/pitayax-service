## Sendmail
<table>
    <tbody>
    <tr>
        <td>URL</td>
        <td>/admin/sendmail</td>
    </tr>
    <tr>
        <td>HTTP method</td>
        <td>POST</td>
    </tr>
    <tr>
        <td>Description</td>
        <td>Send one mail with text or html body</td>
    </tr>
    </tbody>
</table>


> Usage:

```javascript
request:
post:/admin/sendmail
headers:{
  content-type: "application/json"
  access-token: "xxxxxx"
}
body:{
  "to": "xxxx@abc.com",
  "subject": "hello",
  "text": "hello world!"
}

response: "OK"
```
