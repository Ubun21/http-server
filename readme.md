0x20  sp
0x0D  cr
0x0A  lf
0x3A  :

#### POST
1. 按照restful风格post起到创建资源的作用。
fs.exsitSync
fs.mkdirSync
fs.writeFileSync
path.resolve
path.dirname

• fs.statSync
• fs.Stats.isFile
• fs.Stats.isDirectory
• fs.readdirSync
• fs.readFileSync
• Status Code: 200 4


WWW-Authenticate: Basic realm=“login"


304 Not Modfies
Cache-Control max-age 在时间未失效前可以使用本地的缓存

浏览器刷新的时候就算缓存没有到期也是会重新想服务器请求,在缓存有效时间内使用浏览器的前进后退功能会使用本地缓存

在有效时间内浏览器直接使用本地缓存
超时的情况浏览器会带上IF-NO-MATCH上有文件再要,服务端对比一下如果没有更新返回304