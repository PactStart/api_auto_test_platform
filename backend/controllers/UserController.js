const db = require("../config/db");
const { jwtSecretKey } = require("../config/jwtSecretKey");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { parseToken } = require("../utils/TokenParser");
const { getClientIp } = require("../utils/RequestUtil");
const { convertKeyToCamelCase } = require("../utils/CommonUtil");
const { deleteKey, sAdd } = require("../config/redis");

exports.loginByUserName = (req, res) => {
  let { username, password } = req.body;
  const userSelectSql = "select * from sys_user where username = ?";
  db.query(userSelectSql, username, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (!results || !results.length) {
      return res.send({
        code: 1,
        msg: "账号不存在",
      });
    }
    const compareState = bcrypt.compareSync(password, results[0].password);
    if (!compareState) {
      return res.send({
        code: 1,
        msg: "密码错误",
      });
    }
    const dbUser = results[0];

    const user = {
      id: dbUser.id,
      username: dbUser.username,
      phone: dbUser.phone,
      nickname: dbUser.nickname,
      email: dbUser.email,
      avatar: dbUser.avatar,
      superAdmin: dbUser.super_admin,
    };
    const token = jwt.sign(user, jwtSecretKey, { expiresIn: "24h" });

    const ip = getClientIp(req);
    const now = Date.now();
    const updateSql =
      "update sys_user set last_login_ip = ? , last_login_time = ? where id = ?";
    db.query(updateSql, [ip, now, dbUser.id], (err, results) => {
      if (err) {
        return res.send({
          code:1,
          msg: err.message
        })
      }
      getUserRoleAndPerms(dbUser.id).then(roleAndPerms => {
        let {roleIds,roles,perms} = roleAndPerms;
        let apiPermNames = [];
        let dataPermNames = [];
        perms.forEach(perm => {
          if(perm.type == 'API' && perm.name.startsWith('/api')) {
            apiPermNames.push(perm.name);
          } else if(perm.type == 'Data') {
            dataPermNames.push(perm.name);
          }
        })
        // console.log(apiPermNames,dataPermNames);
        const promiseArr =[];
        if(apiPermNames.length) {
          const promise1 = sAdd(`perm:api:${dbUser.id}`, apiPermNames)
          promiseArr.push(promise1);
        }
        if(dataPermNames.length) {
          const promise2 = sAdd(`perm:data:${dbUser.id}`, dataPermNames)
          promiseArr.push(promise2);
        }
        Promise.all(promiseArr).then(() => {
          res.send({
            code: 0,
            msg: "success",
            data: {
              token: "Bearer " + token,
              user: user,
            },
          });
        })
      })
    });
  });
};

const getUserRoleAndPerms = (userId) => {
  return new Promise( resolve => {
    const roleSelectSql =
      "select r.* from sys_user_role ur join sys_role r on ur.role_id = r.id where ur.user_id = ?";
    db.query(roleSelectSql, userId, (err, results) => {
      if(err) {
        throw err;
      }
      const roleIds = [];
      const roles = [];
      if (results && results.length) {
        results.forEach(item => {
          roles.push(item.name);
          roleIds.push(item.id);
        })
      }
      if(roleIds.length) {
        const permissionSelectSql =
          "select p.type,p.name from sys_role_permission rp join sys_permission p on rp.permission_id = p.id where rp.role_id in (?)";
        db.query(permissionSelectSql, [roleIds.join(",")], (err, results) => {
          if(err) {
            throw err;
          }
          resolve({
            roleIds,
            roles,
            perms: results
          })
        });
      } else {
        resolve({
          roleIds,
          roles,
          perms: []
        })
      }
    });
  });
}

exports.userInfo = (req, res) => {
  const currentUser = parseToken(req);

  const pagePerms = [];
  const buttonPerms = [];
  const roles = [];

  const userSelectSql = "select * from sys_user where id = ?";
  db.query(userSelectSql, currentUser.id, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    user = results[0];
    delete user.password;

    const roleSelectSql =
      "select r.* from sys_user_role ur join sys_role r on ur.role_id = r.id where ur.user_id = ?";
    db.query(roleSelectSql, currentUser.id, (err, results) => {
      if (!err && results && results.length) {
        const roleIds = [];
        for (let index = 0; index < results.length; index++) {
          const role = results[index];
          roles.push(role.name);
          roleIds.push(role.id);
        }
        const permissionSelectSql =
          "select p.type,p.name from sys_role_permission rp join sys_permission p on rp.permission_id = p.id where rp.role_id in (?)";
        db.query(permissionSelectSql, [roleIds.join(",")], (err, results) => {
          if (!err && results.length) {
            for (let index = 0; index < results.length; index++) {
              const perm = results[index];
              if (perm.type == "Page") {
                pagePerms.push(perm.name);
              } else if (perm.type == "Button") {
                buttonPerms.push(perm.name);
              }
            }
          }
          return res.send({
            code: 0,
            data: {
              user: convertKeyToCamelCase(user),
              roles,
              pagePerms,
              buttonPerms,
            },
          });
        });
      } else {
        return res.send({
          code: 0,
          data: {
            user: convertKeyToCamelCase(user),
            roles: [],
            pagePerms: [],
            buttonPerms: []
          },
        });
      }
    });
  });
};

exports.logout = (req, res) => {
  const currentUser = parseToken(req);
  deleteKey(`perm:api:${currentUser.id}`);
  deleteKey(`perm:data:${currentUser.id}`);
  res.send({
    code: 0,
    msg: "success",
  });
};

exports.updatePwd = (req, res) => {
  const currentUser = parseToken(req);
  let { oldPassword, newPassword } = req.body;
  const selectSql = "select * from sys_user where id = ?";
  db.query(selectSql, currentUser.id, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (!results || !results.length) {
      return res.send({
        code: 1,
        msg: "当前用户已被删除",
      });
    }
    const compareState = bcrypt.compareSync(oldPassword, results[0].password);
    if (!compareState) {
      return res.send({
        code: 1,
        msg: "旧密码错误",
      });
    }
    const passwordB = bcrypt.hashSync(newPassword, 10);
    const updateSql =
      "update sys_user set password = ?, update_at = ?, update_by = ? where id = ?";
    db.query(
      updateSql,
      [passwordB, Date.now(), currentUser.nickname, currentUser.id],
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
  });
};

exports.resetPwd = (req, res) => {
  const currentUser = parseToken(req);
  if (!currentUser.superAdmin) {
    return res.send({
      code: 1,
      msg: "只有超级管理员才能重置他人密码",
    });
  }
  let { id, password } = req.body;
  const passwordB = bcrypt.hashSync(password, 10);
  const updateSql =
    "update sys_user set password = ?, update_at = ?, update_by = ? where id = ?";
  db.query(
    updateSql,
    [passwordB, Date.now(), currentUser.nickname, id],
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

exports.addUser = (req, res) => {
  let { username, password, nickname } = req.body;

  const selectSql = "select * from sys_user where username = ?";
  db.query(selectSql, username, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (results && results.length) {
      return res.send({
        code: 1,
        msg: "该账号名已存在",
      });
    }
    const passwordB = bcrypt.hashSync(password, 10);
    const currentUser = parseToken(req);
    const now = Date.now();
    const insertSql =
      "insert into sys_user(username,password,nickname,create_at,create_by,update_at,update_by) values(?,?,?,?,?,?,?)";
    db.query(
      insertSql,
      [username, passwordB, nickname, now, currentUser.nickname, now, ""],
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
  });
};

exports.deleteUser = (req, res) => {
  let { id } = req.body;
  const deleteSql = "update sys_user set del = 1 where id = ?";
  db.query(deleteSql, id, (err, results) => {
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

exports.updateUser = (req, res) => {
  let { id, phone, email } = req.body;
  const currentUser = parseToken(req);
  if (currentUser.id === id || currentUser.superAdmin) {
    const updateSql =
      "update sys_user set phone = ?,email = ?,update_at = ? ,update_by = ? where id = ?";
    db.query(
      updateSql,
      [phone, email, Date.now(), currentUser.nickname, id],
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
  } else {
    res.send({
      code: 1,
      msg: "您无权修改其他用户的账号信息",
    });
  }
};

exports.queryUser = (req, res) => {
  //获取前端的参数
  let { keyword, page, size } = req.query;
  page = (page - 1) * size;

  //查询用户列表sql
  let pageSql = "select * from sys_user where del = 0 order by id limit ?,?";
  //查询用户总数的sql
  let totalSql = "select count(*) as total from sys_user where del = 0";
  let params = [];
  if (keyword) {
    keyword = "%" + keyword + "%";
    pageSql =
      "select * from sys_user where del=0 and (nickname like ? or username like ? or phone like ? or email like ? ) order by id limit ?,?";
    totalSql =
      "select count(*) as total from sys_user where del=0 and (nickname like ? or username like ? or phone like ? or email like ? )";
    params = [keyword, keyword, keyword, keyword];
  }
  db.query(
    pageSql,
    [...params, Number(page), Number(size)],
    (err, results1) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      db.query(totalSql, params, (err, results2) => {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
          });
        }
        results1.forEach((row) => {
          delete row.password;
          delete row.mfa_key;
        });
        res.send({
          code: 0,
          data: {
            list: convertKeyToCamelCase(results1),
            total: results2[0].total,
          },
        });
      });
    }
  );
};
