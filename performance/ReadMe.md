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

4、基本组件适用

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

