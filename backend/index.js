const express = require("express");
const app = express();
const { cacheApiPerm, API_PERM_KEY } = require("./service/PermissionService");
const { sIsMember, hGet, connect } = require("./config/redis");
const { parseToken } = require("./utils/TokenParser");

/**
 * 解析post请求的body数据
 */
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * 跨域请求配置
 */
const cors = require("cors");
app.use(cors());

/**
 * 健康检查端口
 */
const defaultRouter = express.Router();
defaultRouter.get("/", (req, res) => {
  res.send("hello,world");
});
app.use("/", defaultRouter);

/**
 * 配置接口文档
 */
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "自动化测试平台-服务端",
      version: "1.0.0",
      description: `
         这是一个用Node开发的API接口测试用例管理平台，你可以很方便的通过swagger接口文档地址批量导入应用的api接口，然后为这些借口创建测试用例，另外我们还提供了python脚本用来执行这些测试用例和生成测试报告。
         祝您玩的开心。
       `,
      contact: {
        name: "Rex.Lei",
        url: "https://github.com/PactStart?tab=repositories",
        email: "1203208955@qq.com",
      },
    },
    host: `localhost:3000`,
    basePath: "/",
    produces: ["application/json"],
    schemes: ["http", "https"],
  },
  apis: [path.join(__dirname, "/routers/*.js")],
};

// 定义swagger 访问的路由
const swaggerSpec = swaggerJsdoc(options);
app.use("/swagger", swaggerui.serve, swaggerui.setup(swaggerSpec));
app.use("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * 登录&权限检查中间件
 */
app.use((req, res, next) => {
  const url = req.url;
  const permPromise = hGet(API_PERM_KEY, url);
  permPromise.then((value) => {
    if (!value) {
      console.error("接口权限未定义:" + url);
      return next();
    }
    perm = JSON.parse(value);
    console.log(perm);
    if (perm.anon) {
      next();
    } else if (perm.login) {
      const currentUser = parseToken(req);
      if (!currentUser) {
        const token = req.headers.authorization;
        res.send({
          code: -1,
          msg: token ? "登录已过期，请重新登录" : "未登录",
        });
      } else {
        next();
      }
    } else {
      const currentUser = parseToken(req);
      if (!currentUser) {
        const token = req.headers.authorization;
        res.send({
          code: -1,
          msg: token ? "登录已过期，请重新登录" : "未登录",
        });
      } else {
        if (currentUser.superAdmin) {
          next();
        } else {
          const promise = sIsMember(`perm:api:${currentUser.id}`, url);
          promise.then((hasPerm) => {
            console.log(hasPerm);
            if (!hasPerm) {
              return res.send({
                code: 1,
                msg: "权限不足，访问拒绝",
              });
            }
            next();
          });
        }
      }
    }
  });
});

/**
 * 用户接口
 */
const userRouter = require("./routers/user");
app.use("/api/v1/user", userRouter);

/**
 * 角色接口
 */
const roleRouter = require("./routers/role");
app.use("/api/v1/role", roleRouter);

/**
 * 权限接口
 */
const permissionRouter = require("./routers/permission");
app.use("/api/v1/permission", permissionRouter);

/**
 * 应用接口
 */
const appRouter = require("./routers/app");
app.use("/api/v1/app", appRouter);

/**
 * 应用配置接口
 */
const appConfigRouter = require("./routers/appConfig");
app.use("/api/v1/appConfig", appConfigRouter);

/**
 * API接口
 */
const apiRouter = require("./routers/api");
app.use("/api/v1/api", apiRouter);

/**
 * 测试用例接口
 */
const apiTestCaseRouter = require("./routers/apiTestCase");
app.use("/api/v1/testCase", apiTestCaseRouter);

/**
 * 测试计划接口
 */
const apiTestPlanRouter = require("./routers/apiTestPlan");
app.use("/api/v1/testPlan", apiTestPlanRouter);

/**
 * 性能测试Demo接口
 */
const performanceTestRouter = require("./routers/performanceTest");
app.use("/api/v1/pt/goods", performanceTestRouter);

/**
 * 错误中间件
 */
const joi = require("joi");
const jwt = require("jsonwebtoken");
app.use((err, req, res, next) => {
  //joi表单的用户信息校验失败
  if (err instanceof joi.ValidationError) {
    return res.send({
      code: 1,
      message: err.message,
    });
  }
  if (err instanceof jwt.TokenExpiredError) {
    return res.send({
      code: -1,
      message: "登录已过期，请重新登录",
    });
  }
  if (err.name === "UnauthorizedError") {
    return res.send({
      code: 1,
      message: "身份认证失败",
    });
  }
  console.log(err);
  //其他的错误
  res.send({
    code: 1,
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log("server start on http://127.0.0.1:3000");
  const promise = connect();
  promise.then(() => {
    cacheApiPerm();
  });
});
