const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");

exports.addRole = (req, res) => {
  let { name, description } = req.body;
  const selectSql = "select * from sys_role where name = ?";
  db.query(selectSql, name, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (results && results.length) {
      if (!results[0].del) {
        res.send({
          code: 1,
          msg: "角色已存在",
        });
      } else {
        const currentUser = parseToken(req);
        const now = Date.now();
        const updateSql =
          "update sys_role set del = 0, update_at= ?, update_by = ? where id = ?";
        db.query(
          updateSql,
          [now, currentUser.nickname, results[0].id],
          (err, results) => {
            if (err) {
              res.send({
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
      }
    } else {
      const currentUser = parseToken(req);
      const now = Date.now();
      const insertSql =
        "insert into sys_role(name,description,create_at,create_by,update_at) values (?,?,?,?,?)";
      db.query(
        insertSql,
        [name, description, now, currentUser.nickname, now],
        (err, results) => {
          if (err) {
            res.send({
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
    }
  });
};

exports.deleteRole = (req, res) => {
  let { id } = req.body;
  const currentUser = parseToken(req);
  const now = Date.now();
  const deleteSql =
    "update sys_role set del = 1, update_at= ?, update_by = ? where id = ?";
  db.query(deleteSql, [now, currentUser.nickname, id], (err, results) => {
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
  });
};

exports.updateRole = (req, res) => {
  let { id, description } = req.body;
  const currentUser = parseToken(req);
  const now = Date.now();
  const updateSql =
    "update sys_role set description = ?, update_at= ?, update_by = ? where id = ?";
  db.query(
    updateSql,
    [description, now, currentUser.nickname, id],
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

exports.queryRole = (req, res) => {
  let { whereSql, values } = generateWhereSql(req.query, ["name"], ["name"]);

  const selectSql = "select * from sys_role " + whereSql;
  db.query(selectSql, values, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    res.send({
      code: 0,
      data: {
        list: convertKeyToCamelCase(results),
      },
    });
  });
};

exports.assignPermissions = (req, res) => {
  let { roleId, permissionIds } = req.body;

  if (!permissionIds || !permissionIds.length) {
    const deleteSql = "delete from sys_role_permission where role_id = ?";
    db.query(deleteSql, roleId, (err, results) => {
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
    });
  }
  //过滤无效的权限id，避免前端传的权限id在db中不存在
  let ids = permissionIds.join(",");
  const selectSql = `select id from sys_permission where del = 0 and id in ( ${ids} )`;
  db.query(selectSql, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    } else {
      permissionIds = [];
      results.forEach((row) => {
        permissionIds.push(row.id);
      });
    }
  });

  db.getConnection((err, connection) => {
    //获取链接
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
    connection.beginTransaction(function (err) {
      //开启事务
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      const deleteSql = "delete from sys_role_permission where role_id = ?";
      connection.query(deleteSql, roleId, (err, results) => {
        if (err) {
          return connection.rollback(function () {
            // throw err;
            return res.send({
              code: 1,
              msg: err.message,
            });
          });
        }

        const currentUser = parseToken(req);
        const now = Date.now();
        let insertSql =
          "insert sys_role_permission(role_id,permission_id,create_at,create_by,update_at) values";
        for (let index = 0; index < permissionIds.length; index++) {
          const permissionId = permissionIds[index];
          insertSql =
            insertSql +
            `(${roleId},${permissionId},${now},'${currentUser.nickname}',${now}),`;
        }
        insertSql = insertSql.substring(0, insertSql.length - 1);
        console.log(insertSql);

        connection.query(insertSql, (err, results) => {
          if (err) {
            return connection.rollback(function () {
              // throw err;
              return res.send({
                code: 1,
                msg: err.message,
              });
            });
          }
          //提交事务
          connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                // throw err;
                res.send({
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
    });
  });
};

exports.bindPermissions = (req, res) => {
  let { roleId, permissionIds } = req.body;

  //过滤无效的权限id，避免前端传的权限id在db中不存在
  const selectSql = `select id from sys_permission where del = 0 and id in ( ${permissionIds.join(
    ","
  )} )`;
  db.query(selectSql, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    permissionIds = [];
    results.forEach((row) => {
      permissionIds.push(row.id);
    });

    const currentUser = parseToken(req);
    const now = Date.now();
    let insertSql =
      "insert sys_role_permission(role_id,permission_id,create_at,create_by,update_at) values";
    for (let index = 0; index < permissionIds.length; index++) {
      const permissionId = permissionIds[index];
      insertSql =
        insertSql +
        `(${roleId},${permissionId},${now},'${currentUser.nickname}',${now}),`;
    }
    insertSql = insertSql.substring(0, insertSql.length - 1);
    insertSql =
      insertSql +
      `on duplicate key update update_at=values(update_at),update_by='${currentUser.nickname}'`;
    db.query(insertSql, (err, results) => {
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
    });
  });
};

exports.unbindPermissions = (req, res) => {
  let { roleId, permissionIds } = req.body;
  const deleteSql = `delete from sys_role_permission where role_id = ? and permission_id in (${permissionIds.join(
    ","
  )})`;
  db.query(deleteSql, [roleId], (err, results) => {
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
  });
};

exports.listPermissions = (req, res) => {
  let { roleId, page, size } = req.query;
  page = (page - 1) * size;

  const pageSql =
    "select p.id,parent_id,type,anon,name,description,internal from sys_permission p join sys_role_permission rp on p.id = rp.permission_id where rp.del = 0 and rp.role_id = ? order by rp.id desc limit ?,?";
  const totalSql =
    "select count(1) as total from sys_permission p join sys_role_permission rp on p.id = rp.permission_id where rp.del = 0 and rp.role_id = ? ";
  console.log(pageSql, totalSql);
  db.query(pageSql, [roleId, Number(page), Number(size)], (err, result1) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    db.query(totalSql, roleId, (err, result2) => {
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

exports.assignToUsers = (req, res) => {
  let { roleId, userIds } = req.body;
  const deleteSql = `delete from sys_user_role where role_id = ? and user_id in (${userIds.join(
    ","
  )}) `;
  db.query(deleteSql, [roleId], (err, results) => {
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
  });

  const currentUser = parseToken(req);
  const now = Date.now();
  let insertSql =
    "insert sys_user_role(user_id,role_id,create_at,create_by,update_at) values";
  for (let index = 0; index < userIds.length; index++) {
    const userId = userIds[index];
    insertSql =
      insertSql +
      `(${userId},${roleId},${now},'${currentUser.nickname}',${now}),`;
  }
  insertSql = insertSql.substring(0, insertSql.length - 1);
  db.query(insertSql, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
    res.send({
      code: 1,
      msg: "success",
    });
  });
};

exports.bindUsers = (req, res) => {
  let { roleId, userIds } = req.body;
  const currentUser = parseToken(req);
  const now = Date.now();
  let insertSql =
    "insert sys_user_role(user_id,role_id,create_at,create_by,update_at) values";
  for (let index = 0; index < userIds.length; index++) {
    const userId = userIds[index];
    insertSql =
      insertSql +
      `(${userId},${roleId},${now},'${currentUser.nickname}',${now}),`;
  }
  insertSql = insertSql.substring(0, insertSql.length - 1);
  insertSql =
    insertSql +
    `on duplicate key update update_at=values(update_at),update_by=values(create_by)`;
  db.query(insertSql, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
    res.send({
      code: 1,
      msg: "success",
    });
  });
};

exports.unbindUsers = (req, res) => {
  let { roleId, userIds } = req.body;
  const deleteSql =
    "delete from sys_user_role where role_id = ? and user_id in (?)";
  db.query(deleteSql, [roleId, userIds.join(",")], (err, results) => {
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
  });
};

exports.listUsers = (req, res) => {
  let { roleId, page, size } = req.query;
  page = (page - 1) * size;

  const pageSql =
    "select u.id,u.nickname,u.username,u.phone,u.email from sys_user u join sys_user_role ur on u.id = ur.user_id where ur.del = 0 and ur.role_id = ? order by ur.id desc limit ?,?";
  const totalSql =
    "select count(1) as total from sys_user u join sys_user_role ur on u.id = ur.user_id where ur.del = 0 and ur.role_id = ?";

  db.query(pageSql, [roleId, Number(page), Number(size)], (err, results1) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    db.query(totalSql, roleId, (err, result2) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      res.send({
        code: 0,
        data: {
          list: convertKeyToCamelCase(results1),
          total: result2[0].total,
        },
      });
    });
  });
};
