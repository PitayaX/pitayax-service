## 文件上传系统 API 一览

|url                      |方式   |描述             |
| ----------------------- |:-----:| -------------- |
|/fs                      |POST   |上传一个文件     |
|/info/{token}            |GET    |查询一个文件的信息|
|/fs/{token}              |GET    |下载一个文件     |
|/image/{token}?[options] |GET    |获取一张图片     |
|/fs/{token}              |DELETE |删除一个文件     |
