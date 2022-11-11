1、下载安装Jmeter

```
    快速下载 https://jmeter.apache.org/download_jmeter.cgi

    文档地址：http://jmeter.apache.org/usermanual/get-started.html
```

2、Jmeter介绍

```
    bin:核心可执行文件，包含配置
        jmeter.bat: windows启动文件
        jmeter: mac或者linux启动文件
        jmeter-server：mac或者Liunx分布式压测使用的启动文件
        jmeter-server.bat：window分布式压测使用的启动文件
        jmeter.properties: 核心配置文件  
         
    extras：插件拓展的包

    lib:核心的依赖包
```

3、汉化和解决乱码问题

```
     jmeter.properties:
        anguage=zh_CN
        sampleresult.default.encoding=UTF-8
```

4、基本组件使用

```
    1) 线程组
    2）HTTP请求默认值
    3）HTTP信息头管理器
    4）前置处理器
    5）后置处理器
    6）断言
    7）用户自定义变量
    8）BeanShell
```

5、常见业务场景

```
    1）可变参数
    2）关联接口
        需求
        常规接口需要登录后才可以压测，这个怎么处理
        使用接口关联进行压力测试？？？

        案例操作
        登录接口压测 post方式
        个人信息接口压测 get方式

        误区
        个人信息接口需要登录才可以访问，为了压测这个接口，则需要先压测登录获取token
        访问了A接口，再访问了B接口，那你怎么断定是哪个接口影响了性能？哪个接口QPS多少？

        正确方式
        第一接口：参数化批量请求接口，获取相关响应，提取数据保存文件，作为下个接口的入参
        第二接口：通过参数化，读取第一个接口的文件进行操作
```

6、聚合报告分析

```
    lable: sampler的名称
    Samples: 一共发出去多少请求,例如10个用户，循环10次，则是 100
    Average: 平均响应时间
    Median: 中位数，也就是 50％ 用户的响应时间

    90% Line : 90％ 用户的响应不会超过该时间 
    95% Line : 95％ 用户的响应不会超过该时间
    99% Line : 99％ 用户的响应不会超过该时间
    min : 最小响应时间
    max : 最大响应时间
    
    Error%：错误的请求的数量/请求的总数
    Throughput： 吞吐量——默认情况下表示每秒完成的请求数（Request per Second) 可类比为qps
    KB/Sec: 每秒接收数据量
```

6、性能测试报告解读

```
    dashboard讲解
        Test and Report informations
            Source file：jtl文件名
            Start Time ：压测开始时间
            End Time ：压测结束时间
            Filter for display：过滤器
            Lable:sampler采样器名称
        APDEX(Application performance Index)
            apdex:应用程序性能指标,范围在0~1之间，1表示达到所有用户均满意
            T(Toleration threshold)：可接受阀值
            F(Frustration threshold)：失败阀值
        Requests Summary
            OK:成功率
            KO:失败率
        Statistics 统计数据
            lable:sampler采样器名称
            samples:请求总数，并发数*循环次数
            KO:失败次数
            Error%:失败率
            Average:平均响应时间
            Min:最小响应时间
            Max:最大响应时间
            90th pct: 90%的用户响应时间不会超过这个值
            95th pct: 95%的用户响应时间不会超过这个值
            99th pct: 99%的用户响应时间不会超过这个值 (存在极端值)
            throughtput:Request per Second吞吐量 qps
            received:每秒从服务器接收的数据量
            send：每秒发送的数据量
    charts讲解
        Over Time（随着时间的变化）
            Response Times Over Time：响应时间变化趋势
            Response Time Percentiles Over Time (successful responses)：最大，最小，平均，用户响应时间分
            Active Threads Over Time：并发用户数趋势
            Bytes Throughput Over Time：每秒接收和请求字节数变化，蓝色表示发送，黄色表示接受
            Latencies Over Time：平均响应延时趋势
            Connect Time Over Time ：连接耗时趋势
        Throughput
            Hits Per Second (excluding embedded resources):每秒点击次数
            Codes Per Second (excluding embedded resources)：每秒状态码数量
            Transactions Per Second：即TPS，每秒事务数
            Response Time Vs Request：响应时间和请求数对比
            Latency Vs Request：延迟时间和请求数对比
        Response Times
            Response Time Percentiles：响应时间百分比
            Response Time Overview：响应时间概述
            Time Vs Threads：活跃线程数和响应时间
            Response Time Distribution：响应时间分布图
```

7、性能测试关键点
```

1)TPS
Transactions Per Second 每秒事务数, 可以是一个接口、多个接口、一个业务流程
包括增删改操作

2)QPS
Queries Per Second， 每秒查询数, 指一台服务器每秒能够响应的查询次数
QPS 只是一个简单查询的统计，不能描述增删改等操作
如果只是查询操作 TPS = QPS

3)RT
响应时间
```

8、断言持续时间
```
高并发下的，接口响应时间增加，如果超过一定时间则认为是超时
断言类型很多，常规Duration Assertion与Response Assertion基本就足够使用了
常规业务里面会有状态码断言，还有RT响应时间要求，这样的话聚合报告的异常错误率就会更满足业务需求

```

9、同步定时器
```
是多用户并发测试，但真正的并发其实是不存在的，用工具模拟并发
前面的测试“线程数”是并发用户数，启动需要时间，不是并发同一时刻访问
常规压测需要模拟全部用户同一时刻访问，比如 秒杀 案例场景
需求：先让全部请求 同时集合在一起，然后再一起访问，实现真正的并发


解决方式 ：Jmeter的同步定时器
将多个请求同步并发操作，同步定时器又可称之为“集合点”
将需要做并发的请求集合在一起后再进行请求

注意事项
设置的值不能大于线程组 数量
最好的情况是 【线程组】 可以被 【用户组】整除
超时时间以毫秒为单位：指定人数 多少毫秒没集合到算超时
超时时间是0则无限等待，如果是大于0，则未达到集合的【用户组】数量，会在超时后执行
```

10、BeanShell
```
什么是BeanShell:
用Java写成的 小型、免费的Java源代码解释器
可以执行标准Java语句和表达式,完全符合java语法的java脚本语言（需要会javase语言）
包括一些脚本命令，有自己的一些语法和方法，是一种松散类型的脚本语言（这点和JS类似）
用于一些复杂的个性化需求，使用更灵活，功能更强大
官网地址：http://www.beanshell.org


使用场景:
需要在jmeter里面对数据的二次处理，定制自己的业务逻辑
对参数进行加密、base64编码、时间格式化、文件操作、自定义断言等
属于Jmeter二次开发
Jmeter里面开启【日志查看】方便调试

BeanShell常用分类:
采样器BeanShell
前置处理器 BeanShell PreProcessor：提前对参数处理比如加密编码
后置处理器 BeanShell PostProcessor ：对返回结果做处理
断言 BeanShell Assert ：验证请求接口是否满足要求

```

11、BeanShell使用外部Java文件
```
需求
常规beanshell里面写代码，适合简单的逻辑
工作里面还会用到更多方法逻辑，需要在idea编辑器里面写，然后进行调用

方式
jar包：放到的lib目录或ext目录下，前面演示过json工具类操作
java文件

步骤
使用 source加载源码，路径可以是绝对路径和相对路径
加载源文件后可以直接使用 类名.方法名（参数）
```

12、非GUI压测
```
./jmeter -n -t /path/to/report.jmx -l /path/to/jtl/result.jtl -e -o /path/to/result

参数说明

-n 非gui方式运行jmeter
-t ：jmx 脚本路径
-l ：result.jtl 运行结果保存路径，注意：.jtl 文件名不能重复，文件夹需要存在
-e ：在脚本运行结束后生成 HTML 报告
-o ：用于存放 HTML 报告的目录，文件夹需要存在
```

13、性能优化手段
```
硬件：CPU、内存、带宽、磁盘、机房网络
程序：应用程序调优、代码逻辑调优
中间件
    分布式缓存
    消息队列
    线程池、连接池
    异步
    数据库
        数据库索引是否合理
        慢查询是否解决
        连接数是否够
        单表是否数量过大
        单表自动是否过多
        是否需要进行分库分表
```