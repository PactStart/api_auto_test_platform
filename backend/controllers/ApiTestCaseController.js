const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
const defaults = require("json-schema-defaults");
const request = require("request");

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
        }
      );
    });
  });
};

exports.deleteApiTestCase = (req, res) => {
  let { id } = req.body;
  const selectSql = "select * from api_test_case where id = ?";
  db.query(selectSql, id, (err, testCase) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    if (!testCase || testCase.del) {
      return res.send({
        code: 1,
        msg: "您要删除的用例不存在",
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
        const currentUser = parseToken(req);
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
              "update api set case_num = case_num -1  where id = ?";
            connection.query(updateSql, id, (err, results) => {
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
  const updateSql =
    "update api_test_case set name = ?,run = ?, headers = ? , pre_case_id = ?, pre_fields = ?, request_body = ?, assert = ?, update_at = ?, update_by = ? where id = ?";
  db.query(
    updateSql,
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
    ["appId", "apiId", "run", "name", "preCaseId"],
    ["name"]
  );

  //查询api测试用例列表sql
  const pageSql =
    "select * from api_test_case " + whereSql + " order by id desc limit ?,?";

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
    // console.log(bodyExample);
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
    let headerArr = JSON.parse(api.headers);
    if (headerArr.length) {
      for (let item of headerArr) {
        headerExample[item.name] = "$" + item.name;
      }
    }
  }
  if (api.content_type) {
    headerExample["content-type"] = api.content_type;
  }
  return JSON.stringify(headerExample);
};

getAssertExample = () => {
  const defaultAssert = [
    {
      "fieldPath": "$.code",
      "predicate": "=",
      "expectValue": 0,
      "msg": "code不为0"
    }
  ];
  return JSON.stringify(defaultAssert);
}

getPreFieldsExample = () => {
  const defaultPreFields = [
    {
      "field": "Authorization",
      "scope": "header",
      "replaceField": "token"
    }
  ]
  return JSON.stringify(defaultPreFields);
}

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
        const bodyExample = getBodyExample(api);
        const headerExample = getHeaderExample(api);
        const assertExample = getAssertExample();
        const preFieldExample = getPreFieldsExample();

        insertSql = insertSql +`(${appId},'${api.id}','默认',1,'${JSON.stringify(headerExample)}',0,'${preFieldExample}','${bodyExample}','${assertExample}',${now}),${currentUser.nickname},${now}),\r\n`;
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
        const defaultAssert = getAssertExample();
        const defaultPreFields = getPreFieldsExample();
        for (let api of results) {
          let bodyExample = getBodyExample(api);
          let headerExample = getHeaderExample(api);
          insertSql = insertSql +
            `(${appId},${api.id},'${api.api_name}-默认用例，判断code=0',1,${JSON.stringify(headerExample)},0,'${defaultPreFields}',${JSON.stringify(bodyExample)},'${defaultAssert}',${now},'${currentUser.nickname}',${now}),`;
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
  let { appId, preCaseId, preFields } = req.body;
  const selectSql = "select * from api_test_case where id = ? and del = 0";
  db.query(selectSql, preCaseId, (err, results) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    let preCase = null;
    if (results && results.length) {
      preCase = results[0];
    }
    if (!preCase) {
      return res.send({
        code: 1,
        msg: "前置用例不存在",
      });
    }
    if (preCase.app_id != appId) {
      return res.send({
        code: 1,
        msg: "用例不属于该应用，不能设置为前置用例",
      });
    }
    const updateSql =
      "update api_test_case set pre_case_id  = ?, pre_fields = ? where app_id = ? and id != ? and del = 0 ";
    db.query(
      updateSql,
      [preCaseId, preFields, appId, preCaseId],
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
  });
};

exports.debug = (req, res) => {
  let { url, requestMethod, requestHeaders, queryString, requestBody } = req.body;

  let options = {};
  if(requestMethod == 'get') {
    options = {
      uri: url+'?' + queryString,
      method: requestMethod,
      headers: JSON.parse(requestHeaders),
    };
  } else {
    options = {
      uri: url,
      method: requestMethod,
      headers: JSON.parse(requestHeaders),
      body: requestBody,
    };
  }
  request(options, (err, response, body) => {
    if (err) {
      console.error(err);
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    res.send({
      code: 0,
      msg: "success",
      data: {
        statusCode: response.statusCode,
        headers: response.headers,
        body: response.body,
      },
    });
  });
};
