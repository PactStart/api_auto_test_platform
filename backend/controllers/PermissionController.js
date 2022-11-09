const db = require("../config/db");
const request = require("request");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");
const {
  updateApiPermCache,
  removeApiPermCache,
} = require("../service/PermissionService");

const { requestSwaggerApiTree } = require("../utils/RequestUtil");


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
      const record = results[0];
      const currentUser = parseToken(req);
      const now = Date.now();
      const deleteSql =
        "update sys_permission set del = 1, update_at= ?, update_by = ? where id = ?";
      db.query(deleteSql, [now, currentUser.nickname, id], (err, results) => {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
          });
        }
        if(record.type == 'API') {
          removeApiPermCache(record.name);
        }
        res.send({
          code: 0,
          msg: "success",
        });
      });
    }
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

exports.importApiPermission = (req, res) => {
  let { url } = req.body;
  const currentUser = parseToken(req);
  const now = Date.now();
  requestSwaggerApiTree(url,'默认分组').then(groupArr => {
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
        const promiseArr = [];
        groupArr.forEach(groupObj => {
          const promise = insertGroup(connection, groupObj,now,currentUser);
          promiseArr.push(promise);
        });
        Promise.all(promiseArr).then(() => {
          //提交事务
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                // throw err;
                return es.send({
                  code: 1,
                  msg: err.message,
                });
              });
            }
            console.log('提交事务')
            res.send({
              code: 0,
              msg: "success",
            });
          });
        }).catch(err => {
          res.send({
            code: 1,
            msg: err.message
          });
        })
      });
    });
  })
}


const insertGroup = async (connection,groupObj,now,currentUser) => {
  return new Promise(resolve => {
    let groupName = groupObj.groupName;
    let insertGroupSql ="insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values (?,?,?,?,?,?,?,?,?) on duplicate key update update_at = values(update_at)";
    connection.query(insertGroupSql,[0,"API",0,groupName, groupName, 0,now,currentUser.nickname, now],(err, results) => {
      if (err) {
        throw err;
      }
      console.log('insertGroup')
      //获取分组对应的id
      let groupId = results.insertId;
      //遍历分组
      const promiseArr = [];
      groupObj.moduleArr.forEach(moduleObj => {
        const promise = insertModule(connection,groupId,moduleObj,now,currentUser);
        promiseArr.push(promise);
      });
      Promise.all(promiseArr).then(() => {
        resolve();
      })
    });
  });
}

const insertModule = async (connection,groupId, moduleObj,now,currentUser) => {
  return new Promise(resolve => {
    const moduleName = moduleObj.moduleName;
    let insertModuleSql ="insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values (?,?,?,?,?,?,?,?,?) on duplicate key update update_at = values(update_at)";
    connection.query(insertModuleSql,[groupId,"API",0,moduleName, moduleName, 0,now,currentUser.nickname, now],(err, results) => {
      if (err) {
        throw err;
      }
      console.log('insertModule')
      //获取模块对应的id
      let moduleId = results.insertId;
      insertApi(connection,moduleId,moduleObj.children,now,currentUser).then(() => {
        resolve();
      })
    });
  });
}

const insertApi= async (connection,moduleId, apis, now,currentUser) => {
  return new Promise(resolve => {
    //遍历摸下的所有API
    let insertSql = "insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values \r\n";
    apis.forEach(api => {
      insertSql = insertSql +`(${moduleId},'API',0,'${api.apiUrl}','${api.apiName}',0,${now},'${currentUser.nickname}',${now}),\r\n`;
    })
    insertSql = insertSql.substring(0,insertSql.lastIndexOf(","));
    insertSql =insertSql +
      `on duplicate key update 
      description=values(description),
      update_at=values(update_at),
      update_by='${currentUser.nickname}'`;
      connection.query(insertSql, (err, results) => {
        if (err) {
          throw err;
        }
        console.log('insertApi')
        resolve();
      });
  });
}

exports.importPagePermission = (req, res) => {
  let { pages } = req.body;
  const now = Date.now();
  const currentUser = parseToken(req);
  let promiseArr = [];
  for (const page of pages) {
    const promise = insertPagePerm(page, 0, now, currentUser);
    promiseArr.push(promise);
  }
  Promise.all(promiseArr).then(() => {
    res.send({
      code:0,
      msg:'success'
    })
  });
};

const insertPagePerm = async (page, parentId, now, currentUser) => {
  return new Promise(resolve => {
    let insertSql = `insert sys_permission(parent_id,type,anon,name,description,internal,create_at,create_by,update_at) values 
        (${parentId},'Page',${!!page.isAuth ? 1 : 0},'${page.path}','${page.title}',0,${now},'${currentUser.nickname}',${now}) 
        on duplicate key update description=values(description),update_at=values(update_at),update_by='${currentUser.nickname}'`;
    db.query(insertSql, (err, results) => {
      if (err) {
        throw err;
      }
      let promiseArr = [];
      if (page.children && page.children.length) {
        for (const item of page.children) {
          const promise = insertPagePerm(item, results.insertId, now, currentUser);
          promiseArr.push(promise);
        }
      }
      Promise.all(promiseArr).then(function () {
        resolve();
      });
    });
  }) 
};