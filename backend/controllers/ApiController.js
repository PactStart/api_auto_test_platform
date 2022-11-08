const db = require("../config/db");
const { parseToken } = require("../utils/TokenParser");
const {
  generateWhereSql,
  convertKeyToCamelCase,
} = require("../utils/CommonUtil");
const { requestSwaggerApi } = require("../utils/RequestUtil");

exports.addApi = (req, res) => {
  let {
    appId,
    groupName,
    moduleName,
    apiName,
    url,
    requestMethod,
    contentType,
    query,
    body,
    headers,
  } = req.body;

  const currentUser = parseToken(req);
  const now = Date.now();
  const insertSql = `insert api(app_id,group_name,module_name,api_name,url,request_method,content_type,query,body,headers,create_at,create_by,update_at,update_by) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?) 
    on duplicate key update del = 0,update_at = values(update_at),update_by = values(update_by)`;
  db.query(
    insertSql,
    [
      appId,
      groupName,
      moduleName,
      apiName,
      url,
      requestMethod,
      contentType,
      query,
      body,
      headers,
      now,
      currentUser.nickname,
      now,
      currentUser.nickname,
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

exports.deleteApi = (req, res) => {
  let { id } = req.body;
  const deleteSql = "update api set del = 1 where id = ?";
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

exports.updateApi = (req, res) => {
  let {
    id,
    appId,
    groupName,
    moduleName,
    apiName,
    url,
    requestMethod,
    contentType,
    query,
    body,
    headers,
  } = req.body;

  const currentUser = parseToken(req);
  const now = Date.now();
  const updateSql =
    "update api set app_id = ?,group_name = ?, module_name = ? , api_name = ?, request_method = ?, content_type = ?, query = ? , body = ? , headers = ? , update_at = ?, update_by = ? where id = ?";
  db.query(
    updateSql,
    [
      appId,
      groupName,
      moduleName,
      apiName,
      url,
      requestMethod,
      contentType,
      query,
      body,
      headers,
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

exports.queryApi = (req, res) => {
  let { page, size } = req.query;
  page = (page - 1) * size;

  let { whereSql, values } = generateWhereSql(
    req.query,
    ["appId", "groupName", "moduleName", "apiName"],
    ["apiName"]
  );

  //查询api列表sql
  const pageSql = "select * from api " + whereSql + " order by id limit ?,?";

  //查询api总数的sql
  const totalSql = "select count(*) as total from api" + whereSql;

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

exports.importSwaggerApi = (req, res) => {
  let { groupName, appId, url } = req.body;
  let apiArr = [];
  const promise = requestSwaggerApi(
    url,
    !!groupName ? groupName : "默认分组",
    apiArr
  );
  promise.then((groupNum) => {
    // console.log(apiArr.length);
    const currentUser = parseToken(req);
    const now = Date.now();
    let insertSql =
      "insert api(app_id,group_name,module_name,api_name,url,request_method,content_type,query,body,headers,create_at,create_by,update_at) values \r\n";

    const moduleNameSet = new Set();
    for (let index = 0; index < apiArr.length; index++) {
      const api = apiArr[index];
      moduleNameSet.add(api["moduleName"]);
      insertSql =
        insertSql +
        `(${appId},'${api.groupName}','${api.moduleName}','${api.apiName}','${
          api.apiUrl
        }','${api.requestMethod}','${api.contentType}','${JSON.stringify(
          api.query
        )}','${JSON.stringify(api.body)}','${JSON.stringify(
          api.headers
        )}',${now},'${currentUser.nickname}',${now}),\r\n`;
    }
    insertSql = insertSql.substring(0, insertSql.lastIndexOf(","));
    insertSql =
      insertSql +
      ` on duplicate key update 
        group_name=values(group_name),
        module_name=values(module_name),
        api_name=values(api_name),
        request_method=values(request_method),
        content_type=values(content_type),
        query = values(query),
        body = values(body),
        headers = values(headers),
        update_at=values(update_at),
        update_by='${currentUser.nickname}'`;
    // console.log(insertSql);
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
        data: {
          groupNum,
          moduleNum: moduleNameSet.size,
          apiNum: apiArr.length,
        },
      });
    });
  });
};

exports.queryGroupAndModule = (req, res) => {
  let { appId } = req.query;
  const selectGroupSql =
    "select distinct(group_name) as groupName from api where app_id = ? and del = 0";
  db.query(selectGroupSql, appId, (err, result1) => {
    if (err) {
      return res.send({
        code: 1,
        msg: err.message,
      });
    }
    const selectModuleSql =
      "select distinct(module_name) as moduleName from api where app_id = ? and del = 0";
    db.query(selectModuleSql, appId, (err, result2) => {
      if (err) {
        return res.send({
          code: 1,
          msg: err.message,
        });
      }
      // console.log(result1, result2);
      let groupNameList = !result1.length
        ? []
        : result1.map((row) => row.groupName);
      let moduleNameList = !result2.length
        ? []
        : result2.map((row) => row.moduleName);
      // console.log(groupNameList, moduleNameList);
      res.send({
        code: 0,
        msg: "success",
        data: {
          groupNameList,
          moduleNameList,
        },
      });
    });
  });
};

exports.getById = (req, res) => {
  let { id } = req.query;
  const sql = "select * from api where id = ?";
  db.query(sql, id, (err, results) => {
    if (err) {
      res.send({
        code: 1,
        msg: err.message,
      });
    }
    let api = null;
    if (results && results.length) {
      api = convertKeyToCamelCase(results[0]);
    }
    res.send({
      code: 0,
      msg: "success",
      data: api,
    });
  });
};
