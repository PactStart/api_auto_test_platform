const db = require("../config/db");
const request = require("request");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");
const { parseApiTree } = require("../utils/SwaggerParser");
const {
  updateApiPermCache,
  removeApiPermCache,
} = require("../service/PermissionService");

exports.addPermission = (req, res) => {
  let { parentId, type, anon, login, name, description, internal } = req.body;
  anon = !!anon;
  login = !!login;
  internal = !!internal;
  if (!parentId) {
    parentId = 0;
  }

  const currentUser = parseToken(req);
  const now = Date.now();
  const insertSql =
    "insert sys_permission(parent_id,type,anon,login,name,description,internal,create_at,create_by,update_at) values(?,?,?,?,?,?,?,?,?,?)";
  db.query(
    insertSql,
    [
      parentId,
      type,
      anon,
      login,
      name,
      description,
      internal,
      now,
      currentUser.nickname,
      now,
    ],
    (err, results) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      res.send({
        code: 0,
        msg: "success",
      });
    }
  );
};

exports.deletePermission = (req, res) => {
  let { id } = req.body;
  const selectSql = "select * from sys_permission where id =?";
  db.query(selectSql, id, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (results && results.length) {
      if (results[0].internal) {
        return res.send({
          code: 1,
          msg: "内置权限不允许删除",
        });
      }
      const currentUser = parseToken(req);
      const now = Date.now();
      const deleteSql =
        "update sys_permission set del = 1, update_at= ?, update_by = ? values (?,?,?) where id = ?";
      db.query(deleteSql, [now, currentUser.nickname, id], (err, results) => {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
          });
        }
        removeApiPermCache(id);
        res.send({
          code: 0,
          msg: "success",
        });
      });
    }
    res.send({
      code: 0,
      msg: "success",
    });
  });
};

exports.updatePermission = (req, res) => {
  let { id, parentId, anon, login, type, name, description, internal } =
    req.body;
  anon = !!anon;
  login = !!login;
  internal = !!internal;
  if (!parentId) {
    parentId = 0;
  }

  selectSeql = "select * from sys_permission where id =?";
  db.query(selectSeql, id, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (results && results.length) {
      if (results[0].internal) {
        return res.send({
          code: 1,
          msg: "内置权限不允许修改",
        });
      }
      const currentUser = parseToken(req);
      const now = Date.now();
      const updateSql =
        "update sys_permission set parent_id = ?, type = ?, anon = ?, login = ?, name = ?, description = ?, internal = ? , update_at= ?, update_by = ? where id = ?";

      db.query(
        updateSql,
        [
          parentId,
          type,
          anon,
          login,
          name,
          description,
          internal,
          now,
          currentUser.nickname,
          id,
        ],
        (err, results) => {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          updateApiPermCache(id);
          res.send({
            code: 0,
            msg: "success",
          });
        }
      );
    } else {
      res.send({
        code: 1,
        msg: "您要修改的权限不存在",
      });
    }
  });
};

exports.queryPermission = (req, res) => {
  //获取前端的参数
  let { page, size } = req.query;
  page = (page - 1) * size;

  let { whereSql, values } = generateWhereSql(
    req.query,
    ["name", "anon", "login", "type", "internal"],
    ["name"]
  );

  //查询权限列表sql
  const pageSql =
    "select * from sys_permission " + whereSql + " order by id limit ?,?";
    console.log(pageSql)

  //查询权限总数的sql
  const totalSql = "select count(*) as total from sys_permission " + whereSql;

  db.query(pageSql, [...values, Number(page), Number(size)], (err, result1) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    db.query(totalSql, values, (err, result2) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      res.send({
        code: 0,
        data: {
          list: convertKeyToCamelCase(result1),
          total: result2[0].total,
        },
      });
    });
  });
};

exports.importSwaggerApiPermission = (req, res) => {
  let { url } = req.body;
  request(
    {
      uri: url,
      method: "GET",
    },
    (err, response, body) => {
      if (err || response.statusCode != 200) {
        return res.send({
          code: 1,
          msg: "swagger接口文档读取失败",
        });
      }
      let obj = JSON.parse(body);
      let groupNum = 0;
      let groupArr = [];
      if (obj instanceof Array) {
        groupNum = obj.length;
        for (let index = 0; index < obj.length; index++) {
          const groupObj = obj[index];
          const groupName = groupObj.name;
          const groupUrl = groupObj.url;
          let domain;
          if (
            url.startsWith("http://") ||
            url.startsWith("http://") ||
            url.startsWith("//")
          ) {
            domain = url.split("/")[2];
          } else {
            domain = url.split("/")[0];
          }
          const fullGroupUrl = domain + "/" + groupUrl;
          request(
            {
              uri: fullGroupUrl,
              method: "GET",
            },
            (err, response, body) => {
              if (err || response.statusCode != 200) {
                return res.send({
                  code: 1,
                  msg: "swagger分组接口文档读取失败：" + fullGroupUrl,
                });
              }
              const apiDocObj = JSON.parse(body);
              if (Object.hasOwnProperty.call(obj, "paths")) {
                const moduleArr = parseApiTree(groupName, apiDocObj);
                groupArr.push({
                  name: groupName,
                  children: moduleArr,
                });
              } else {
                throw new Error("swagger api格式非法，不能解析paths字段");
              }
            }
          );
        }
      } else if (Object.hasOwnProperty.call(obj, "paths")) {
        const moduleArr = parseApiTree("默认分组", obj);
        groupArr.push({
          name: "/",
          description: "默认分组",
          children: moduleArr,
        });
        groupNum = 1;
      } else {
        throw new Error("swagger api格式非法，不能解析paths字段");
      }

      const currentUser = parseToken(req);
      const now = Date.now();

      // console.log(JSON.stringify(groupArr));
      db.getConnection((err, connection) => {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
          });
        }
        connection.beginTransaction(function (err) {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          for (let apiGroup of groupArr) {
            //插入api分组
            let insertGroupSql =
              "insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values (?,?,?,?,?,?,?,?,?) on duplicate key update update_at = values(update_at)";
            connection.query(
              insertGroupSql,
              [
                0,
                "API",
                0,
                apiGroup.name,
                apiGroup.description,
                0,
                now,
                currentUser.nickname,
                now,
              ],
              (err, groupInsertResults) => {
                if (err) {
                  return res.send({
                    code: 1,
                    msg: err.message,
                  });
                }
                //获取分组对应的id
                let groupId = groupInsertResults.insertId;

                //遍历分组下的模块
                for (let apiModule of apiGroup.children) {
                  //插入模块
                  let insertModuleSql =
                    "insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values (?,?,?,?,?,?,?,?,?) on duplicate key update update_at = values(update_at)";
                  connection.query(
                    insertModuleSql,
                    [
                      groupId,
                      "API",
                      0,
                      apiModule.name,
                      apiModule.description,
                      0,
                      now,
                      currentUser.nickname,
                      now,
                    ],
                    (err, moduleInsertResults) => {
                      if (err) {
                        return res.send({
                          code: 1,
                          msg: err.message,
                        });
                      }
                      //获取模块对应的id
                      let moduleRecordId = moduleInsertResults.insertId;

                      //插入api
                      let insertSql =
                        "insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values \r\n";
                      for (let api of apiModule.children) {
                        insertSql =
                          insertSql +
                          `(${moduleRecordId},'API',0,'${api.apiUrl}','${api.apiName}',0,${now},'${currentUser.nickname}',${now}),\r\n`;
                      }
                      insertSql = insertSql.substring(
                        0,
                        insertSql.lastIndexOf(",")
                      );
                      insertSql =
                        insertSql +
                        `on duplicate key update 
                                description=values(description),
                                update_at=values(update_at),
                                update_by='${currentUser.nickname}'`;

                      connection.query(insertSql, (err, results) => {
                        if (err) {
                          return res.send({
                            code: 1,
                            msg: err.message,
                          });
                        }
                      });
                    }
                  );
                }
              }
            );
          }
          //提交事务
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                // throw err;
                return res.send({
                  code: 1,
                  msg: err.message,
                });
              });
            }
            res.send({
              code: 0,
              msg: "success",
            });
          });
        });
      });
    }
  );
};
