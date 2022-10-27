const db = require("../config/db");
const {parseToken} = require('../utils/TokenParser');

const {generateWhereSql,convertKeyToCamelCase} = require('../utils/CommonUtil');

exports.addApiTestCase = (req,res) => {
    let {appId,apiId,name,run,headers,preCaseId,preFields,requestBody,assert} = req.body;
    
    const currentUser = parseToken(req);
    const now = Date.now();
    db.getConnection((err,connection) => {
        if(err) {
            return res.send({
                code: 1,
                msg: err.message
            })
        }
        connection.beginTransaction(function(err) {
            if(err) {
                return res.send({
                    code: 1,
                    msg: err.message
                })
            }
            const insertSql = 'insert api_test_case(app_id,api_id,name,run,headers,pre_case_id,pre_fields,request_body,assert,create_at,create_by,update_at,update_by) values(?,?,?,?,?,?,?,?,?,?,?,?,?)';
            connection.query(insertSql,[appId,apiId,name,run,headers,preCaseId,preFields,requestBody,assert,now,currentUser.nickname,now,''],(err,results) => {
                if(err) {
                    return res.send({
                        code: 1,
                        msg: err.message
                    })
                }
                return res.send({
                    code: 0,
                    msg: 'success'
                })
            })
            const updateCaseNumSql = 'update api set case_num = case_num + 1 where id = ?';
            connection.query(updateCaseNumSql,apiId,(err,results) => {
                if(err) {
                    return res.send({
                        code: 1,
                        msg: err.message
                    })
                }
                //提交事务
                connection.commit(function(err) {
                if (err) {
                    return connection.rollback(function() {
                        // throw err;
                        res.send({
                            code: 1,
                            msg: err.message
                        })
                    });
                }
                res.send({
                        code: 0,
                        msg: 'success'
                    })
                });
            })
        });
    });
    
}

exports.deleteApiTestCase = (req,res) => {
    let {id} = req.body;
    const currentUser = parseToken(req);
    const deleteSql = 'update api_test_case set del = 1, update_at = ?, update_by = ? where id = ?';
    db.query(deleteSql,[Date.now(),currentUser.nickname,id],(err,results) => {
        if(err) {
            return res.send({
                code: 1,
                msg: err.message
            })
        }
        res.send({
            code: 0,
            msg: "success"
        })
    });
}

exports.updateApiTestCase = (req,res) => {
    let {id,name,run,headers,preCaseId,preFields,requestBody,assert} = req.body;
    const currentUser = parseToken(req);
    const now = Date.now();
    'update api_test_case set name = ?,run = ?, headers = ? , pre_case_id = ?, pre_fields = ?, request_body = ?, assert = ?, update_at = ?, update_by = ? where id = ?'
    db.query(insertSql,[name,run,headers,preCaseId,preFields,requestBody,assert,now,currentUser.nickname,id],(err,results) => {
        if(err) {
            return res.send({
                code: 1,
                msg: err.message
            })
        }
        res.send({
            code: 0,
            msg: 'success'
        })
    })

}

exports.queryApiTestCase = (req,res) => {
    let { page, size } = req.query;
    page = (page - 1) * size;

    let {whereSql,values} = generateWhereSql(req.query,['appId','apiId','run','name'],[]);

    //查询api测试用例列表sql
    const pageSql = 'select * from api_test_case '+ whereSql +' order by id limit ?,?';

    //查询api测试用例总数的sql
    const totalSql = 'select count(*) as total from api_test_case' + whereSql;

    db.query(pageSql, [...values, Number(page), Number(size)], (err, result1) => {
    if (err) {
        return res.send({ 
            code: 1, 
            msg: err.message 
        });
    }
    db.query(totalSql, values, (err, result2) => {
      if (err) {
        return res.send({ 
            code: 1, 
            msg: err.message 
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
}
