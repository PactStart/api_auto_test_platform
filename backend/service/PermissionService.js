const db = require("../config/db");
const { hSet, hDel } = require("../config/redis");

const API_PERM_KEY = "sys:perm:api";

exports.API_PERM_KEY = API_PERM_KEY;
exports.cacheApiPerm = () => {
  selectSql = `select * from sys_permission where type = 'API' and del = 0 and name like '/%'`;
  db.query(selectSql, (err, results) => {
    if (err) {
      console.log("加载API权限失败", err);
      return;
    }
    console.log("加载API权限" + results.length + "条");
    if (results && results.length) {
      let promiseArr = [];
      for (const perm of results) {
        const promise = hSet(API_PERM_KEY, perm.name, JSON.stringify(perm));
        promiseArr.push(promise);
      }
      Promise.all(promiseArr)
        .then(() => {
          console.log(API_PERM_KEY + "同步缓存成功");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.updateApiPermCache = (id) => {
  selectSql =
    "select * from sys_permission where id = ? and type = ? and del = 0";
  db.query(selectSql, [id, "API"], (err, results) => {
    if (err) {
      console.log("加载API权限失败", err);
      return;
    }
    if (results && !results.length) {
      for (const perm of results) {
        const promise = hSet(API_PERM_KEY, perm.name, JSON.stringify(perm));
        promise.then(() => {
          console.log(API_PERM_KEY + "同步缓存成功");
        });
      }
    }
  });
};

exports.removeApiPermCache = (url) => {
  const promise = hDel(API_PERM_KEY, url);
  promise.then(() => {
    console.log(API_PERM_KEY + "同步缓存成功");
  });
};
