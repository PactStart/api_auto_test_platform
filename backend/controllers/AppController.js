const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");

exports.addApp = (req, res) => {
  let { name } = req.body;

  const selectSql = "select * from app where name = ?";
  db.query(selectSql, name, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (results && results.length) {
      return res.send({
        code: 1,
        msg: "应用已存在",
      });
    }
    const currentUser = parseToken(req);
    const now = Date.now();
    const insertSql =
      "insert app(name,create_at,create_by,update_at,update_by) values(?,?,?,?,?)";
    db.query(
      insertSql,
      [name, now, currentUser.nickname, now, ""],
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

exports.deleteApp = (req, res) => {
  let { id } = req.body;
  const deleteSql =
    "update app set del = 1,update_at = ?,update_by = ? where id = ?";
  db.query(
    deleteSql,
    [Date.now(), currentUser.nickname, id],
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

exports.updateApp = (req, res) => {
  let { id, name } = req.body;
  const currentUser = parseToken(req);
  const updateSql =
    "update app set name = ?,update_at = ?,update_by = ? where id = ?";
  db.query(
    updateSql,
    [name, Date.now(), currentUser.nickname,id],
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

exports.queryApp = (req, res) => {
  //获取前端的参数
  let { page, size } = req.query;
  page = (page - 1) * size;

  let { whereSql, values } = generateWhereSql(req.query, ["name"], ["name"]);

  //查询应用列表sql
  const pageSql = "select * from app " + whereSql + " order by id limit ?,?";

  //查询应用总数的sql
  const totalSql = "select count(*) as total from app " + whereSql;

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
