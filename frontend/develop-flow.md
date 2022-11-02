1、安装vue-cli

```
    cnpm install @vue-cli
```

2、创建项目

```
    vue create frontend
```

3、忽略template标签警告

```
    <!-- jsconfig.json -->
    "jsx": "preserve"
```

4、新建目录结构

```
    views       //路由页面
    components  //组件
    router      //路由配置
    assets      //图片
    common      //公共样式 
    api         //接口
    utils       //工具：axios封装、全局事件总线等
```

5、安装less预处理器

```
    cnpm i less@4.1.2 less-loader@7 -S

    <style lang="less">
</style>
```

6、编写基础样式base.css
```
    <!--  -->
```
7、安装Antd

```
    <!-- https://antdv.com/docs/vue/getting-started-cn -->
    cnpm install ant-design-vue --save

    全局注册：
    //main.js
    import Antd from 'ant-design-vue';
    import 'ant-design-vue/dist/antd.css'
    createApp(App).use(Antd).mount('#app')

    按需加载：
    // .babelrc or babel-loader option
    {
        "plugins": [
            ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }] // `style: true` 会加载 less 文件
        ]
    }

```

8、配置代码片段
```
    Code->首选项->用户代码片段
    输入vue3生成vue3.code-snippets文件，使用如下配置

    {
	"Print to console": {
		"prefix": "v3",
		"body": [
			"<template>",
			"<div>",
			"",
			"</div>",
			"</template>",
            "<script setup>",
            "</script>",
			"<style lang='less' scoped>",
			"",
			"</style>"
		],
		"description": "Log output to console"
	}
}
```

9、安装vue-router

```
    cnpm install vue-router --save

    //router/index.js

    import { createRouter, createWebHashHistory } from 'vue-router';
    const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
        path: '/',
        redirect: '/login',
        },
        {
        path: '/home',
        component: () => import('../views/Home'),
        meta: {
            isAuth: true,
        },
        },
        {
        path: '/login',
        component: () => import('../views/Login'),
        },
    ],
    });
    // 路由拦截
    router.beforeEach((to, from, next) => {
    //判断是否需要登录权限
    if (to.meta.isAuth) {
        if (localStorage.getItem('token')) {
        next();
        } else {
            message.error('未登录，请先登录');
        router.push('./login');
        }
    } else {
        next();
    }
    });
    export default router;

    //main.js
    import router from './router/index'
    createApp(App).use(Antd).use(router).mount('#app')

    //App.vue
    <template>
        <div>
            <router-view></router-view>
        </div>
    </template>
    <style lang='less' scoped>

    </style>

```
10、安装ant-design/icons-vue
```
    npm install --save @ant-design/icons-vue
    //required: { node: '^12.22.0 || ^14.17.0 || >=16.0.0' }

    升级node版本
    1、清除node缓存
        npm cache clean -f
    2、安装n模块
        npm install -g n
    3、升级node.js到最新稳定版
        n stable  
    4、检查最新的node版本
        node -v

```
11、安装axios
```
    cnpm install axios --save

    //util/request.js

    import router from "@/router/index";
    import axios from "axios";
    /**
    * 创建axios实例
    */
    const ENV = process.env.NODE_ENV;
    const host = ENV === "development" ? "http://127.0.0.1:3000" : "";
    const service = axios.create({
        baseURL: host,
        timeout: "3000",
    });

    /**
    * 请求拦截
    */
    service.interceptors.request.use((config) => {
        if (config.url.indexOf("login") < 0) {
            config.headers.authorization = localStorage.getItem("token");
        }
        return config;
    });

    /**
    * 响应拦截
    */
    service.interceptors.response.use((res) => {
        const { code, data, msg } = res.data;
        if (code === 0) {
            return data;
        } else {
            message.error(msg);
            if (code === -1) {
            router.push("/login");
            }
        }
    });

    /**
    * 封装请求函数
    */
    const request = (options) => {
        if (options.method === "get") {
            options.params = options.data;
        }
        return service(options);
    };

    export default request;

    //api/index.js
    import request from "../utils/request";
    /**
    * 登录接口
    */
    export const getLogin = (data) => {
        return request({ method: "post", url: "/api/v1/user/login", data });
    };

    /**
    * 获取用户信息接口
    */
    export const getUserInfo = () => {
        return request({ method: "get", url: "/api/v1/user/userInfo" });
    };


```







QA:
1、ref函数和reactive函数的区别？
```
    1)处理数据类型不同： ref 可以处理基本类型和对象（数组）类型数据，reactive 只能处理对象（数组）类型数据
    2)实现原理不同：ref 处理基本类型数据通过 Object.defineProperty() 实现(RefImpl)，reactive 通过 Proxy 实现
    3)操作不同：ref 操作数据需要加 .value
```
2、toRef函数和toRefs函数的作用？
```
    1)toRef: 创建一个 ref 对象，其 value 值指向另一个对象中指定的属性,将某个响应式对象的某一个属性提供给外部使用
        const name = toRef(person, "name");

    2)toRefs: 批量创建多个 ref 对象，其 value 值指向另一个对象中指定的属性,将某个响应式对象的全部属性提供给外部使用
        setup() {
            let person = reactive({
                name: "张三",
                age: 19,
            });
            return {
                ...toRefs(person),
            };
        },

```