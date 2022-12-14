const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
  recursionFindAllNonredundant,
} = require("../utils/CommonUtil");

exports.addApiTestPlan = (req, res) => {
  let { appId, chooseAllCase, caseIds, baseUrl, name } = req.body;

  let selectSql;
  if (chooseAllCase) {
    selectSql = `select 
        tc.id as case_id,
        tc.name as case_name,
        group_name,
        module_name,
        api_name,
        url,
        request_method,
        content_type,
        tc.headers,
        pre_case_id,
        pre_fields,
        request_body,
        assert
        from api_test_case tc 
        join api 
        on tc.api_id = api.id 
        where tc.app_id = ? and tc.del = 0 and tc.run = 1`;
  } else {
    selectSql = `select 
        tc.id as case_id,
        tc.name as case_name,
        group_name,
        module_name,
        api_name,
        url,
        request_method,
        content_type,
        tc.headers,
        pre_case_id,
        pre_fields,
        request_body,
        assert
        from api_test_case tc 
        join api 
        on tc.api_id = api.id 
        where tc.app_id = ? and tc.del = 0 and tc.run = 1 and tc.id in (${caseIds.join(
          ","
        )})`;
  }
  db.query(selectSql, appId, (err, caseRows) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    const preCaseIdMappingSql =
      "select id, pre_case_id from api_test_case where app_id = ? and pre_case_id != 0";
    db.query(preCaseIdMappingSql, appId, (err, results) => {
      if (err) {
        console.log(err);
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      const idMapping = new Map();
      for (let row of results) {
        idMapping.set(row.id, row.pre_case_id);
      }
      effectiveCaseIds = [];
      for (let index = 0; index < caseRows.length; index++) {
        effectiveCaseIds.push(caseRows[index].case_id);
      }
      extraCaseIds = recursionFindAllNonredundant(idMapping, effectiveCaseIds);
      console.log(extraCaseIds);
      //??????
      var tmpCaseIdArr = extraCaseIds.filter(item =>{
        return effectiveCaseIds.indexOf(item) !== -1;
      });
      //??????
      extraCaseIds = extraCaseIds.filter(item => {
        return tmpCaseIdArr.indexOf(item) === -1;
      });
      let promise = Promise.resolve([]);
      if (extraCaseIds && extraCaseIds.length) {
        promise = getCaseByIds(appId, extraCaseIds);
      }
      promise.then(extraCaseRows => {
        console.log(extraCaseRows);
        caseRows.push(...extraCaseRows);
        db.getConnection((err, connection) => {
          if (err) {
            return res.send({
              code: 1,
              msg: err.message,
            });
          }
          connection.beginTransaction(function (err) {
            if (err) {
              console.log(err)
              return res.send({
                code: 1,
                msg: err.message,
              });
            }
            const insertPlanSql =
              "insert api_test_plan(app_id,name,base_url,case_num,create_at,create_by) values (?,?,?,?,?,?)";
            const currentUser = parseToken(req);
            const now = Date.now();
            connection.query(
              insertPlanSql,
              [appId, name, baseUrl, caseRows.length, now, currentUser.nickname],
              (err, results) => {
                if (err) {
                  console.log(err)
                  return res.send({
                    code: 1,
                    msg: err.message,
                  });
                }
                const planId = results.insertId;
  
                let insertRunLogSql = ` insert api_test_plan_run_log(
                              app_id,
                              plan_id,
                              case_id,
                              case_name,
                              group_name,
                              module_name,
                              api_name,
                              url,
                              request_method,
                              content_type,
                              headers,
                              pre_case_id,
                              pre_fields,
                              request_body,
                              assert,
                              create_at,
                              create_by) values 
                          `;
                for (let index = 0; index < caseRows.length; index++) {
                  const caseRow = caseRows[index];
                  insertRunLogSql =
                    insertRunLogSql +
                    `
                              (${appId},${planId},${caseRow.case_id},'${caseRow.case_name}','${caseRow.group_name}','${caseRow.module_name}','${caseRow.api_name}','${caseRow.url}','${caseRow.request_method}',
                                  '${caseRow.content_type}','${caseRow.headers}',${caseRow.pre_case_id},'${caseRow.pre_fields}','${caseRow.request_body}','${caseRow.assert}',${now},'${currentUser.nickname}'),`;
                }
                insertRunLogSql = insertRunLogSql.substring(
                  0,
                  insertRunLogSql.length - 1
                );
  
                db.query(insertRunLogSql, (err, results) => {
                  if (err) {
                    return connection.rollback(function () {
                      // throw err;
                      res.send({
                        code: 1,
                        msg: err.message,
                      });
                    });
                  }
                  const updateCaseIdSql = `
                              update api_test_plan_run_log t1 
                              join api_test_plan_run_log t2 on t1.pre_case_id = t2.case_id 
                              set t1.pre_case_id = t2.id where t1.plan_id = ? and t2.plan_id = ?
                              `;
  
                  db.query(updateCaseIdSql, [planId, planId], (err, results) => {
                    if (err) {
                      return connection.rollback(function () {
                        // throw err;
                        res.send({
                          code: 1,
                          msg: err.message,
                        });
                      });
                    }
                    //????????????
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
              }
            );
          });
        });
      }).catch(err => {
        res.send({
          code:1,
          msg: err.message
        })
      })
    });
  });
};

const getCaseByIds = (appId, ids) => {
  return new Promise(resolve => {
    selectExtraSql = `select 
      tc.id as case_id,
      tc.name as case_name,
      group_name,
      module_name,
      api_name,
      url,
      request_method,
      content_type,
      tc.headers,
      pre_case_id,
      pre_fields,
      request_body,
      assert
      from api_test_case tc 
      join api 
      on tc.api_id = api.id 
      where tc.app_id = ? and tc.id in (${ids.join(",")})`;
    db.query(selectExtraSql, appId, (err, results) => {
      if (err) {
        throw err;
      }
      resolve(results);
    });
  });
};

exports.deleteApiTestPlan = (req, res) => {
  let { id } = req.body;
  const deleteSql = "update api_test_plan set del = 1 where id = ?";
  db.query(deleteSql, id, (err, results) => {
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

exports.getApiTestPlanById = (req, res) => {
  let { id } = req.body;
  const selectSql = "select * from api_test_plan where del = 0 and id = ?";
  db.query(selectSql, id, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
    res.send({
      code: 0,
      msg: "success",
      data: convertKeyToCamelCase(results[0])
    });
  });
};

exports.queryApiTestPlan = (req, res) => {
  let { page, size } = req.query;
  page = (page - 1) * size;

  const dynamicParams = ["appId", "name"];

  let whereSql = " where ";
  let values = [];
  for (let index = 0; index < dynamicParams.length; index++) {
    const key = dynamicParams[index];
    if (Object.hasOwnProperty.call(req.query, key)) {
      const value = object[key];
      if (value != null) {
        if (key === "name") {
          whereSql = whereSql + ` ${camelToUnderline(key)} like ? and `;
          values.push("%" + value + "%");
        } else {
          whereSql = whereSql + ` ${camelToUnderline(key)} = ? and `;
          values.push(value);
        }
      }
    }
  }
  whereSql = whereSql + " del = 0";

  //????????????????????????sql
  const pageSql =
    "select * from api_test_plan " + whereSql + " order by id desc limit ?,?";

  //???????????????????????????sql
  const totalSql = "select count(*) as total from api_test_plan" + whereSql;

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

exports.queryApiTestPlanRunLog = (req, res) => {
  let { page, size } = req.query;
  page = (page - 1) * size;

  let { whereSql, values } = generateWhereSql(
    req.query,
    ["planId", "groupName", "moduleName", "apiName","pass", "caseName"],
    ["groupName", "moduleName", "apiName", "caseName"]
  );

  const pageSql =
    "select * from api_test_plan_run_log " +
    whereSql +
    " order by id limit ?,?";

  const totalSql =
    "select count(*) as total from api_test_plan_run_log" + whereSql;

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
