1、初始化项目
```
    cd backend
    npm install 或者 cnpm install
```
2、配置mysql连接信息和redis连接信息
    修改config/db.js和redis.js中的相应配置

3、启动项目
```
    node index.js
    
    //文件修改，自动重启
    sudo cnpm install nodemon -g
    nodemon index.js
```
4、接口文档
```
    健康检查端口：http://localhost:3000/
    接口文档：http://localhost:3000/swagger
    接口文档json格式：httphttp://localhost:3000/swagger.json

```

5、待完善

    ```
    ```