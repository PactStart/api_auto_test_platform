const db = require("../config/db");
const request = require('request');
const {parseToken} = require('../utils/TokenParser');
const {generateWhereSql} = require('../utils/CommonUtil');
const {parseApi} = require('../utils/SwaggerParser');

exports.addApi = (req,res) => {
    let {appId,groupName,moduleName,apiName,url,requestMethod,contentType} = req.body;
    
    const currentUser = parseToken(req);
    const now = Date.now();
    const insertSql = `insert api(app_id,group_name,module_name,api_name,url,request_method,content_type,create_at,create_by,update_at,update_by) values(?,?,?,?,?,?,?,?,?,?,?) 
    on duplicate key update del = 0,update_at = values(update_at),update_by = values(update_by)`;
    db.query(insertSql,[appId,groupName,moduleName,apiName,url,requestMethod,contentType,now,currentUser.nickname,now,currentUser.nickname],(err,results) => {
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

exports.deleteApi = (req,res) => {
    let {id} = req.body;
    const deleteSql = 'update api set del = 1 where id = ?';
    db.query(deleteSql,id,(err,results) => {
        if(err) {
            res.send({
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

exports.updateApi = (req,res) => {
    let {id,groupName,moduleName,apiName,url,requestMethod,contentType} = req.body;

    const currentUser = parseToken(req);
    const now = Date.now();
    'update api set app_id = ?,group_name = ?, module_name = ? , api_name = ?, request_method = ?, content_type = ?, update_at = ?, update_by = ? where id = ?'
    db.query(insertSql,[groupName,moduleName,apiName,url,requestMethod,contentType,now,currentUser.nickname],(err,results) => {
        if(err) {
            res.send({
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

exports.queryApi = (req,res) => {
    let { page, size } = req.query;
    page = (page - 1) * size;

    let {whereSql,values} = generateWhereSql(req.query,['groupName','moduleName','apiName'],[]);

    //查询api列表sql
    const pageSql = 'select * from api '+ whereSql +' order by id limit ?,?';

    //查询api总数的sql
    const totalSql = 'select count(*) as total from api' + whereSql;

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
                list: result1,
                total: result2[0].total,
                }
            });
        });
  });
}

exports.importSwaggerApi = (req,res) => {
    let {appId,url} = req.body;
    request({
        uri: url,
        method:'GET'
    },(err,response,body) => {
        if(err || response.statusCode != 200) {
            return res.send({
                code:1,
                msg:'swagger接口文档读取失败'
            })
        }
        let obj = JSON.parse(body);
        let apiArr = [];
        let groupNum = 0;
        if(obj instanceof Array) {
            groupNum = obj.length;
            for (let index = 0; index < obj.length; index++) {
                const groupObj = obj[index];
                const groupName = groupObj.name;
                const groupUrl = groupObj.url;
                let domain;
                if(url.startsWith("http://") || url.startsWith("http://") || url.startsWith("//")) {
                    domain = url.split("/")[2];
                } else {
                    domain = url.split("/")[0];  
                }
                const fullGroupUrl = domain + '/' + groupUrl;
                request({
                    uri: fullGroupUrl,
                    method: 'GET'
                },(err,response,body) => {
                    if(err || response.statusCode != 200) {
                        return res.send({
                            code:1,
                            msg:'swagger分组接口文档读取失败：' + fullGroupUrl
                        })
                    }
                    const apiDocObj = JSON.parse(body);
                    if(Object.hasOwnProperty.call(obj, 'paths')){
                        apiArr = parseApi(groupName,apiDocObj);
                    } else {
                        throw new Error('swagger api格式非法，不能解析paths字段');
                    }
                });
            }
        } else if(Object.hasOwnProperty.call(obj, 'paths')){
            apiArr = parseApi('默认分组',obj);
            groupNum = 1;
        } else {
            throw new Error('swagger api格式非法，不能解析paths字段');
        }
        
        const currentUser = parseToken(req);
        const now = Date.now();
        let insertSql = 'insert api(app_id,group_name,module_name,api_name,url,request_method,content_type,create_at,create_by,update_at) values \r\n';

        const moduleNameSet = new Set();
        for (let index = 0; index < apiArr.length; index++) {
            const api = apiArr[index];
            moduleNameSet.add(api['moduleName']);
            insertSql = insertSql + `(${appId},'${api.groupName}','${api.moduleName}','${api.apiName}','${api.apiUrl}','${api.requestMethod}','${api.contentType}',${now},'${currentUser.nickname}',${now}),\r\n`;
        }
        insertSql = insertSql.substring(0,insertSql.lastIndexOf(','));
        insertSql = insertSql + `on duplicate key update 
        group_name=values(group_name),
        module_name=values(module_name),
        api_name=values(api_name),
        request_method=values(request_method),
        content_type=values(content_type),
        update_at=values(update_at),
        update_by='${currentUser.nickname}'`;
        db.query(insertSql,(err,results) => {
            if(err) {
                return res.send({
                    code: 1,
                    msg: err.message
                })
            }
            res.send({
                code: 0,
                msg: 'success',
                data: {
                    groupNum: groupNum,
                    moduleNum: moduleNameSet.size,
                    apiNum: apiArr.length
                }
            })
        })
    })
}