## 文件系统 API 一览表

|url                      |方式   |描述             |备注               |
| ----------------------- |:-----:| -------------- | ----------------- |
|/fs                      |POST   |上传一个文件     |                   |
|/info/{token}            |GET    |查询一个文件的信息|特意查询文件是否存在 |
|/fs/{token}              |GET    |下载一个文件     |                   |
|/image/{token}?[options] |GET    |获取一张图片     |                   |
|/fs/{token}              |DELETE |删除一个文件     |                   |

## 文件系统 API 详细说明

### /fs 上传一个文件

|Key|Value|
|---|-----|
|URL|/fs|
|方式|POST|
|描述|上传一个文件|

#### Request内容:

```
Request Headers:{
  Content-Length:上传文件的大小,Eg:832568,
  Content-Type:上传文件的类型,Eg:image/jpeg,
  FILENAME:上传文件的名称,Eg:haok.jpg
}
Request Body:{
  // var xhr = new XMLHttpRequest();
  // xhr.send(fileData);
}
```

#### Request内容:

```
{
  content-type: 文件类型,Eg:"image/jpeg",
  file-hash: 文件的哈希值,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: 文件的名字,Eg:"haok.jpg",
  file-token: 文件的Token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  size: 文件的大小,Eg:"832568"
}
```

### /info/{token} 查询一个文件的信息

|Key|Value|
|---|-----|
|URL|/info/{token}|
|方式|GET|
|描述|查询一个文件的信息|

#### Request内容:

```
GET: http://10.10.73.207:8081/info/{token}
Eg: http://10.10.73.207:8081/info/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_
Request Headers:{
}
Request Body:{
}
```

#### Request内容:

```
{
  content-type: 文件类型,Eg:"image/jpeg",
  file-hash: 文件的哈希值,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: 文件的名字,Eg:"haok.jpg",
  file-token: 文件的Token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  size: 文件的大小,Eg:"832568"
}
```

### /fs/{token} 获取下载文件地址

|Key|Value|
|---|-----|
|URL|/fs/{token}|
|方式|GET|
|描述|获取下载文件地址|

#### Request内容:

```
GET: http://10.10.73.207:8081/fs/{token}
Eg: http://10.10.73.207:8081/fs/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_
Request Headers:{
}
Request Body:{
}
```

#### Request内容:

```
{
  content-type: 文件类型,Eg:"image/jpeg",
  file-hash: 文件的哈希值,Eg:"FomzOar7oEA7-18JCg5Mcoh1c8lC",
  file-name: 文件的名字,Eg:"haok.jpg",
  file-token: 文件的Token,Eg:"jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_",
  file-url: 文件的下载地址,Eg:"http://7xjb3g.com1.z0.glb.clouddn.com/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_haok.jpg?e=1443153392&token=ozb2VtztIhltSBqGREUIhcrgvHERXxSxR9b5eLSa:pHSy94sSqlLEiwKVBYyaYXPIKAM="
  size: 文件的大小,Eg:"832568"
}
```

### /image/{token}?[options] 获取图片

|Key|Value|
|---|-----|
|URL|/image/{token}?[options]|
|方式|GET|
|描述|获取图片|
|Code|302重定向|

#### Request内容:

```
GET: http://10.10.73.207:8081/image/{token}?[options] 可设置图片模式，宽度，高度
Eg: http://10.10.73.207:8081/image/jVaZyiuFlDIZt5i0riwsEo7bY0Mu9tPK2gET0-RmpnHyRIodflUaGaWXEQ0kmIs8Xn7S6Lg9XqF1VsfPaRpur82PpQqyX1By17wteGkH9es_?mode=1&width=100&height=200
Request Headers:{
}
Request Body:{
}
```

#### Request内容:

```
重定向至七牛图片下载链接
```
