1、初始化项目
```
    cd backend
    npm init
```
2、安装express
```
    cnpm i express@4.17.3 --save
```
3、编写index.js
```
    const express = require('express');
    const app = express();

    app.listen(3000,()=>{
        console.log('server start on http://127.0.0.1:3000');
    })

```
4、启动nodejs项目
```
    node index.js
    
    sudo cnpm install nodemon -g
    nodemon index.js
```
5、编写路由
```
    //controller/userController.js
    exports.register = (req,res) => {
    console.log('register');
    }
    exports.login = (req,res) => {
        console.log('login');
    }
    exports.userInfo = (req,res) => {
        console.log('userInfo');
    }

    //routers/user.js
    const express = require('express');
    const router = express.Router();

    const userController = require('../controller/userController')

    router.post('/register',userController.register);
    router.post('/login',userController.login);
    router.get('/userInfo',userController.userInfo);

    module.exports = router;

    //index.js
    const userRouter = require('./routers/user');
    app.use('/api/v1/user',userRouter);

```
6、接收请求body的参数
```
    cnpm install body-parser@1.19.2 --save

    //index.js
    const bodyParser = require('body-parser');
    app.use(bodyParser.json);
    app.use(bodyParser.urlencoded({extended: false}));
```
7、参数校验
```
    <!-- https://www.npmjs.com/package/joi -->
    cnpm install joi@17.4.0 --save

    <!-- https://www.npmjs.com/package/@escook/express-joi -->
    cnpm install @escook/express-joi@1.1.1 --save

    const expressJoi = require('@escook/express-joi')
    const userSchema = {
        body: {
            userName: Joi.string().alphanum().min(3).max(12).required(),
            password: Joi.string()
            .pattern(/^[\S]{6,15}$/)
            .required()
        }
    }
    router.post('/register',expressJoi(userSchema),userController.register);

```
8、全局错误处理
```
    const joi = require('joi');
    app.use((err, req, res, next) => {
    //joi表单的用户信息校验失败
    if (err instanceof joi.ValidationError) {
        return res.send({
        code: 1,
        message: err.message,
        });
    }
    if (err.name === 'UnauthorizedError') {
        return res.send({
        code: 1,
        message: '身份认证失败',
        });
    }
    //其他的错误
    res.send({
        code: 1,
        message: err.message,
    });
    });
```
9、配置mysql
```
    cnpm install mysql@2.8.1 --save
    //config/db.js
    
    const db = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'auto_test'
    });
    module.exports = db;
```
10、mysql查询与插入
```
    const userSelectSql = 'select * from user where name = ?';
    db.query(userSelectSql,userName,(err,results) => {
        if(err) {
            //...
        } else {
            //...
        }
    });

    const userInsertSql = 'insert into user(name,pwd,head_img) value (?,?,?)';
    db.query(userInsertSql,[userName,password,imgList[index]],(err,results) => {
        if(err) {
            //...
        } else {
            //...
        }
    })

```
11、密码加密
```
    cnpm install bcryptjs@2.4.3 --save

    <!-- https://www.npmjs.com/package/bcryptjs -->
    const passwordB = bcrypt.hashSync(password, 10);

```
12、生成访问凭证jwt token
```
    cnpm install jsonwebtoken@8.5.1 --save
    <!-- https://www.npmjs.com/package/jsonwebtoken -->
    const token = jwt.sign(user,'node_vue_mysql',{ expiresIn: '24h' });

    const user = jwt.verify(token.split('Bearer ')[1],'node_vue_mysql');


```
13、配置跨域
```
    cnpm install cors@2.8.5 --save
    <!-- https://www.npmjs.com/package/cors -->
    const cors = require('cors');
    app.use(cors());

```

### QA

1、多表操作如何实现事务？

2、mysql查询结果bit类型字段默认转为Buffer，如何转位bool类型？

3、mysql查询结果中的字段是下划线命名风格，如何转为驼峰命名？

4、中间件执行顺序？权限校验和全局异常处理如何实现?

5、常见导致cannot get path/to/bar 的原因有哪些?

6、如何实现参数校验？

7、get和post参数如何获得？

8、如何给接口添加swagger风格的注释，用于生成接口文档？

9、import和require的区别？

10、where条件不确定时，如何简化拼接sql？

11、“Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client”

12、async和await，Promise的用法
   
    ```
        https://blog.csdn.net/DGMM_/article/details/120616758
    ```
13、joi schema未定义的参数，实际传递后，在req.body或者req.query中能否取得？

14、如何调试
    
    ```
    chrome://inspect/#devices
    node --inspect-brk index.js
    ```
15、如何获取插入记录的id

16、如何等待多个异步请求完成后，再继续逻辑处理

17、根据json shcema生成默认的json样例

18、Promise.all简化代码

19、App Crash如何解决？提前响应，异步代码抛出异常会导致AppCrashed