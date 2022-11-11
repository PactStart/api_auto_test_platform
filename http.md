1、什么是Http超文本传输协议
```
1)协议
    协议是⼀种约定，规定好⼀种信息的格式，如果发送⽅按照这种请求格式发送信息，那么接 收端就要按照这样的格式解析数据，这就是协议

    json协议

    {
        "name":"admin",
        "age":29
    }
    xml协议

    <user>
        <name></name>
        <age></age>
        <pwd></pwd>
    </user>

2)什么是http协议
    即超⽂本传送协议(Hypertext Transfer Protocol )，是Web联⽹的基础，也是⼿机PC联⽹常⽤的协议之⼀，HTTP协议是建⽴在TCP协议之上的⼀种应⽤
    HTTP连接最显著的特点是客户端发送的每次请求都需要服务器回送响应，从建⽴连接到关闭连接的过程称为“⼀次连接”
    HTTP请求-HTTP响应
    响应码：
        1xx:信息
        2xx:成功 200 OK，请求正常
        3xx:重定向
        4xx:客户端错误 404 Not Found 服务器⽆法找到被请求的⻚⾯
        5xx:服务器错误 503 Service Unavailable，服务器挂了或者不 可⽤
        发展历史
        http0.9-》http1.0-》http1.1-》http2.0
        不多优化协议，增加更多功能
    发展历史
        http0.9-》http1.0-》http1.1-》http2.0
        不多优化协议，增加更多功能
    和https的关系
        Hyper Text Transfer Protocol over SecureSocket Layer
        主要由两部分组成：HTTP + SSL / TLS
        比 HTTP 协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性,增加破解成本
        缺点：相同网络环境下，HTTPS 协议会使页面的加载时间延长近 50%，增加额外的计算资源消耗，增加 10%到 20%的耗电等；不过利大于弊，所以Https是趋势，相关资源损耗也在持续下降
        如果做软件压测：直接压测内网ip，通过压测公网域名，不管是http还是https，都会带来额外的损耗导致结果不准确
```

2、Http消息体
```
Http请求消息结构
    请求行
        请求方法
        URL地址
        协议名
    请求头
        报文头包含若干个属性 格式为“属性名:属性值”，
        服务端据此获取客户端的基本信息
    请求体
        请求的参数，可以是json对象，也可以是前端表单生成的key=value&key=value的字符串
Http响应消息结构
    响应行
        报文协议及版本、状态码
    响应头
        报文头包含若干个属性 格式为“属性名:属性值”
    响应正文
        响应报文体，我们需要的内容，多种形式比如html、json、图片、视频文件等
```
3、 HTTP的九种请求方法和响应码
```
    浏览器请求方法
        http1.0定义了三种：
        GET: 向服务器获取资源，比如常见的查询请求
        POST: 向服务器提交数据而发送的请求
        Head: 和get类似，返回的响应中没有具体的内容，用于获取报头

        http1.1又定义了六种:
        PUT：一般是用于更新请求，比如更新个人信息、商品信息全量更新
        PATCH：PUT 方法的补充,更新指定资源的部分数据
        DELETE：用于删除指定的资源
        OPTIONS: 获取服务器支持的HTTP请求方法,服务器性能、跨域检查等
        CONNECT: 方法的作用就是把服务器作为跳板，让服务器代替用户去访问其它网页，之后把数据原原本本的返回给用户，网页开发基本不用这个方法，如果是http代理就会使用这个，让服务器代理用户去访问其他网页，类似中介
        TRACE：回显服务器收到的请求，主要用于测试或诊断
    Http响应码

        浏览器向服务器请求时，服务端响应的消息头里面有状态码，表示请求结果的状态
        分类
            1XX: 收到请求，需要请求者继续执行操作，比较少用
            2XX: 请求成功，常用的 200
            3XX: 重定向，浏览器在拿到服务器返回的这个状态码后会自动跳转到一个新的URL地址，这个地址可以从响应的Location首部中获取；
            好处：网站改版、域名迁移等，多个域名指向同个主站导流
        重点：
            301：永久性跳转，比如域名过期，换个域名
            302：临时性跳转
            4XX: 客户端出错，请求包含语法错误或者无法完成请求
            400: 请求出错，比如语法协议
            403: 没权限访问
            404: 找不到这个路径对应的接口或者文件
            405: 不允许此方法进行提交，Method not allowed，比如接口一定要POST方式，而你是用了GET
            5XX: 服务端出错，服务器在处理请求的过程中发生了错误
            500: 服务器内部报错了，完成不了这次请求
            503: 服务器宕机
```

4、Http请求头
```
    http请求分为三部分：请求行，请求头， 请求体
    请求头
        报文头包含若干个属性 格式为“属性名:属性值”，
        服务端据此获取客户端的基本信息
    常见的请求头
        Accept： 览器支持的 MIME 媒体类型, 比如 text/html,application/json,image/webp,/ 等
        Accept-Encoding: 浏览器发给服务器,声明浏览器支持的编码类型，gzip, deflate
        Accept-Language: 客户端接受的语言格式,比如 zh-CN
        Connection: keep-alive , 开启HTTP持久连接
        Host：服务器的域名
        Origin：告诉服务器请求从哪里发起的，仅包括协议和域名 CORS跨域请求中可以看到response有对应的header，Access-Control-Allow-Origin
        Referer：告诉服务器请求的原始资源的URI，其用于所有类型的请求，并且包括：协议+域名+查询参数； 很多抢购服务会用这个做限制，必须通过某个入来进来才有效
        User-Agent: 服务器通过这个请求头判断用户的软件的应用类型、操作系统、软件开发商以及版本号、浏览器内核信息等； 风控系统、反作弊系统、反爬虫系统等基本会采集这类信息做参考
        Cookie: 表示服务端给客户端传的http请求状态,也是多个key=value形式组合，比如登录后的令牌等
        Content-Type： HTTP请求提交的内容类型，post提交时才需要设置，比如文件上传，表单提交、json等
        form表单提交：application/x-www-form-urlencoded
        json方式提交：application/json
```

5、Http响应头
```
    响应头
        报文头包含若干个属性 格式为“属性名:属性值”
    常见的响应头
        Allow: 服务器支持哪些请求方法
        Content-Length: 响应体的字节长度
        Content-Type: 响应体的MIME类型
        Content-Encoding: 设置数据使用的编码类型
        Date: 设置消息发送的日期和时间
        Expires: 设置响应体的过期时间,一个GMT时间，表示该缓存的有效时间
        cache-control: Expires的作用一致，都是指明当前资源的有效期, 控制浏览器是否直接从浏览器缓存取数据还是重新发请求到服务器取数据,优先级高于Expires,控制粒度更细，如max-age=240，即4分钟
        Location：表示客户应当到哪里去获取资源，一般同时设置状态代码为3xx
        Server: 服务器名称
        Transfer-Encoding：chunked 表示输出的内容长度不能确定，静态网页一般没，基本出现在动态网页里面
        Access-Control-Allow-Origin: 定哪些站点可以参与跨站资源共享
```

6、Http常见请求/响应头content-type内容类型
```
    Content-type: 用来指定不同格式的请求响应信息，俗称 MIME媒体类型
    常见的取值
        text/html ：HTML格式
        text/plain ：纯文本格式
        text/xml ： XML格式
        image/gif ：gif图片格式
        image/jpeg ：jpg图片格式
        image/png：png图片格式
        application/json：JSON数据格式
        application/pdf ：pdf格式
        application/octet-stream ：二进制流数据，一般是文件下载
        application/x-www-form-urlencoded：form表单默认的提交数据的格式，会编码成key=value格式
        multipart/form-data： 表单中需要上传文件的文件格式类型
    Http知识加深文档：https://developer.mozilla.org/zh-CN/docs/Web/HTTP
```