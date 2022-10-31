const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
var defaults = require("json-schema-defaults");

const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");

exports.addApiTestCase = (req, res) => {
  let {
    appId,
    apiId,
    name,
    run,
    headers,
    preCaseId,
    preFields,
    requestBody,
    assert,
  } = req.body;

  const currentUser = parseToken(req);
  const now = Date.now();
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
      const insertSql =
        "insert api_test_case(app_id,api_id,name,run,headers,pre_case_id,pre_fields,request_body,assert,create_at,create_by,update_at,update_by) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
      connection.query(
        insertSql,
        [
          appId,
          apiId,
          name,
          run,
          headers,
          preCaseId,
          preFields,
          requestBody,
          assert,
          now,
          currentUser.nickname,
          now,
          "",
        ],
        (err, results) => {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          return res.send({
            code: 0,
            msg: "success",
          });
        }
      );
      const updateCaseNumSql =
        "update api set case_num = case_num + 1 where id = ?";
      connection.query(updateCaseNumSql, apiId, (err, results) => {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
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
};

exports.deleteApiTestCase = (req, res) => {
  let { id } = req.body;
  const currentUser = parseToken(req);
  db.getConnection((err, connection) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    const selectSql = "select * from api_test_case where id = ?";
    connection.query(selectSql, id, (err, testCase) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      if (testCase || testCase.del) {
        return res.send({
          code: 1,
          msg: "您要删除的用例不存在",
        });
      }
      connection.beginTransaction(function (err) {
        if (err) {
          return res.send({
            code: 1,
            msg: err.message,
          });
        }
        const now = Date.now();
        const deleteSql =
          "update api_test_case set del = 1, update_at = ?, update_by = ? where id = ?";
        connection.query(
          deleteSql,
          [now, currentUser.nickname, id],
          (err, results) => {
            if (err) {
              return res.send({
                code: 1,
                msg: err.message,
              });
            }
            const updateSql =
              "update api set case_num = case_num -1 , update_at = ?, update_by = ? where id = ?";
            connection.query(
              updateSql,
              [now, currentUser.nickname, testCase.id],
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
          }
        );
      });
    });
  });
};

exports.updateApiTestCase = (req, res) => {
  let { id, name, run, headers, preCaseId, preFields, requestBody, assert } =
    req.body;
  const currentUser = parseToken(req);
  const now = Date.now();
  ("update api_test_case set name = ?,run = ?, headers = ? , pre_case_id = ?, pre_fields = ?, request_body = ?, assert = ?, update_at = ?, update_by = ? where id = ?");
  db.query(
    insertSql,
    [
      name,
      run,
      headers,
      preCaseId,
      preFields,
      requestBody,
      assert,
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
      res.send({
        code: 0,
        msg: "success",
      });
    }
  );
};

exports.queryApiTestCase = (req, res) => {
  let { page, size } = req.query;
  page = (page - 1) * size;

  let { whereSql, values } = generateWhereSql(
    req.query,
    ["appId", "apiId", "run", "name"],
    []
  );

  //查询api测试用例列表sql
  const pageSql =
    "select * from api_test_case " + whereSql + " order by id limit ?,?";

  //查询api测试用例总数的sql
  const totalSql = "select count(*) as total from api_test_case" + whereSql;

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

getBodyExample = (api) => {
  let bodyExample = {};
  if (
    api.request_method == "post" &&
    api.content_type == "application/json" &&
    api.body
  ) {
    const schema = JSON.parse(api.body);
    bodyExample = defaults(schema);
    console.log(bodyExample);
  } else if (api.request_method == "get") {
    queryParamArr = JSON.parse(api.query);
    if (queryParamArr.length) {
      for (const item of queryParamArr) {
        if (item.type == "string") {
          bodyExample[item.name] = "";
        } else if (item.type == "integer") {
          if (item.name == "page") {
            bodyExample[item.name] = 1;
          } else if (item.name == "size") {
            bodyExample[item.name] = 10;
          } else {
            bodyExample[item.name] = 0;
          }
        }
      }
    }
  }
  return JSON.stringify(bodyExample);
};

getHeaderExample = (api) => {
  let headerExample = {};
  if (api.headers) {
    headerArr = JSON.parse(api.headers);
    if (headerArr.length) {
      for (item of headerArr) {
        headerExample[item.name] = "$" + item.name;
      }
    }
  }
  if (api.content_type) {
    headerExample["content-type"] = api.content_type;
  }
  return JSON.stringify(headerExample);
};

exports.createDefault = (req, res) => {
  let { id } = req.body;
  const selectSql = "select * from api where id = ? and del = 0";
  db.query(selectSql, id, (err, results) => {
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
        const api = results[0];

        let insertSql =
          "insert api_test_case(app_id,api_id,name,run,headers,pre_case_id,pre_fields,request_body,assert,create_at,create_by,update_at) values \r\n";
        const defaultAssert =
          '[{"fieldPath":"$.code","predicate":"=","expectValue":0,"msg":"code不为0"}]';
        let bodyExample = getBodyExample(api);
        let headerExample = getHeaderExample(api);
        insertSql =
          insertSql +
          `(${appId},'${api.id}','默认',1,'${JSON.stringify(
            headerExample
          )}',0,'{}','${bodyExample}','${defaultAssert}',${now}),${
            currentUser.nickname
          },${now}),\r\n`;
        insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));

        connection.query(insertSql, (err, results) => {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          const updateCaseNumSql =
            "update api set case_num = case_num + 1 where id = ?";
          connection.query(updateCaseNumSql, id, (err, results) => {
            if (err) {
              return res.send({
                code: 1,
                msg: err.message,
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
  });
};

exports.createDefaultForAll = (req, res) => {
  let { appId } = req.body;
  const selectSql = "select * from api where app_id = ? and del = 0";
  db.query(selectSql, appId, (err, results) => {
    console.log(err);
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (!results || !results.length) {
      return res.send({
        code: 1,
        msg: "该应用下没有任何API接口，请先创建或导入",
      });
    }
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
        let insertSql =
          "insert api_test_case(app_id,api_id,name,run,headers,pre_case_id,pre_fields,request_body,assert,create_at,create_by,update_at) values ";

        const now = Date.now();
        const currentUser = parseToken(req);
        const defaultAssert =
          '[{"fieldPath":"$.code","predicate":"=","expectValue":0,"msg":"code不为0"}]';
        for (let api of results) {
          let bodyExample = getBodyExample(api);
          let headerExample = getHeaderExample(api);
          insertSql =
            insertSql +
            `
                    (${appId},${api.id},'${
              api.api_name
            }-默认用例，判断code=0',1,${JSON.stringify(
              headerExample
            )},0,'[]',${JSON.stringify(
              bodyExample
            )},'${defaultAssert}',${now},'${currentUser.nickname}',${now}),`;
        }
        insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));
        connection.query(insertSql, (err, results) => {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          const updateCaseNumSql =
            "update api set case_num = case_num + 1 where app_id = ?";
          connection.query(updateCaseNumSql, appId, (err, results) => {
            if (err) {
              return res.send({
                code: 1,
                msg: err.message,
              });
            }
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
              res.send({
                code: 0,
                msg: "success",
              });
            });
          });
        });
      });
    });
  });
};

exports.batchSetPreCase = (req, res) => {
  let { appId, preCaseId } = req.body;
  const updateSql =
    "update api_test_case set pre_case_id  = ? where app_id = ? and id != ? and del = 0 ";
  db.query(updateSql, [appId, preCaseId, preCaseId], (err, results) => {
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
  });
};
