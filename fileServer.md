## FileServer API Preview

|url                      |method   |describe            |note             |
| ----------------------- |:-----:| -------------- | ----------------- |
|/fs                      |POST   |upload a file     |                   |
|/info/{token}            |GET    |get the file info |you needn't get info unless you need get file specially |
|/fs/{token}              |GET    |download a file     |                   |
|/image/{token}?[options] |GET    |show a picture     |                   |
|/fs/{token}              |DELETE |delete a file     |                   |

---

## FileServer API Detial

### 1. /fs Upload a file

|Key|Value|
|---|-----|
|URL|/fs|
|method|POST|
|describe|upload a file|

#### Request:

```
Request Headers:{
  Content-Length:upload file size,Eg:832568,
  Content-Type:upload file type,Eg:image/jpeg, it can be also multipart/form-data upload，but now it support multipart/form-data by one file upload
  FILENAME:upload file name,Eg:haok.jpg
}
Request Body:{
  // var xhr = new XMLHttpRequest();
  // xhr.send(fileData);
}
```

#### Response:

```
{
  content-type: file type,Eg:"image/jpeg",
  file-hash: file hash,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: file name,Eg:"haok.jpg",
  file-token: file Token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  size: file size,Eg:"832568"
}
```

---

### 2. /info/{token} Get the file info

|Key|Value|
|---|-----|
|URL|/info/{token}|
|method|GET|
|describe|get the file info|

#### Request:

```
GET: http://10.10.73.207:8081/info/{token}
Eg: http://10.10.73.207:8081/info/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_
Request Headers:{
}
Request Body:{
}
```

#### Response:

```
{
  content-type: file type,Eg:"image/jpeg",
  file-hash: file hash,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: file name,Eg:"haok.jpg",
  file-token: file Token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  size: file size,Eg:"832568"
}
```

---

### 3. /fs/{token} download a file

|Key|Value|
|---|-----|
|URL|/fs/{token}|
|method|GET|
|describe|download a file|

#### Request:

```
GET: http://10.10.73.207:8081/fs/{token}
Eg: http://10.10.73.207:8081/fs/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_
Request Headers:{
}
Request Body:{
}
```

#### Response:

```
{
  content-type: file type,Eg:"image/jpeg",
  file-hash: file hash,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: file name,Eg:"haok.jpg",
  file-token: file token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  file-url: file download url,Eg:"http://7xjb3g.com1.z0.glb.clouddn.com/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_haok.jpg?e=1443153392&token=ozb2VtztIhltSBqGREUIhcrgvHERXxSxR9b5eLSa:pHSy94sSqlLEiwKVBYyaYXPIKAM="
  size: file size,Eg:"832568"
}
```

---

### 4. /image/{token}?[options] show a picture

|Key|Value|
|---|-----|
|URL|/image/{token}?[options]|
|method|GET|
|describe|show a picture|
|Code|302 redirect|

#### Request:

```
GET: http://10.10.73.207:8081/image/{token}?[options] can set picture mode, height and width
Eg: http://10.10.73.207:8081/image/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_?mode=1&width=100&height=200
Request Headers:{
}
Request Body:{
}
```

#### Response:

```
redirect to qiniu picture url
```

---

### 5. /fs/{token} delete a file

|Key|Value|
|---|-----|
|URL|/image/{token}?[options]|
|method|DELETE|
|describe|delete a file|

#### Request:

```
GET: http://10.10.73.207:8081/fs/{token}
Eg: http://10.10.73.207:8081/fs/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_
Request Headers:{
}
Request Body:{
}
```

#### Response:

```
{
  ok: 1 or 0
}
```

---
