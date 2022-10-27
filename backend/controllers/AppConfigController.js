const db = require("../config/db");
const {parseToken} = require('../utils/TokenParser');
const {generateWhereSql,convertKeyToCamelCase} = require('../utils/CommonUtil');

exports.addAppConfig = (req,res) => {
    let {appId,configKey,configValue,description} = req.body;
    
    const selectSql = "select * from app_config where app_id = ? and config_key = ?";
    db.query(selectSql,[appId,configKey],(err,results) => {
        if(err) {
            return res.send({
                code: 1,
                msg: err.message
            })
        }
        if(results && results.length) {
            const updateSql = "update app_config set del = 0,config_value = ? where app_id = ? and config_key = ?";
            db.query(updateSql,[configValue,appId,configKey],(err,results) => {
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
        const currentUser = parseToken(req);
        const now = Date.now();
        const insertSql = 'insert app_config(app_id,config_key,config_value,description,create_at,create_by,update_at) values(?,?,?,?,?,?,?)';
        db.query(insertSql,[appId,configKey,configValue,description,now,currentUser.nickname,now],(err,results) => {
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
    })
}

exports.deleteAppConfig = (req,res) => {
    let {id} = req.body;
    const currentUser = parseToken(req);
    const deleteSql = 'update app_config set del = 1,update_at = ?, update_by = ? where id = ?';
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

exports.updateAppConfig = (req,res) => {
    let {appId,configKey,configValue} = req.body;
    const updateSql = 'update app_config set config_value = ? where app_id = ? and config_key = ?';
    db.query(updateSql,[configValue,appId,configKey],(err,results) => {
        if(err) {
            return res.send({
                code: 0,
                msg: err.message
            })
        }
        res.send({
            code: 0,
            msg: 'success'
        })
    })
}

exports.queryAppConfig = (req,res) => {
    //获取前端的参数
    let {page, size } = req.query;
    page = (page - 1) * size;

    let {whereSql,values} = generateWhereSql(req.query,['appId','configKey'],['configKey']);

    //查询app配置列表sql
    const pageSql = 'select * from app_config '+ whereSql +' order by id limit ?,?';

    //查询app配置总数的sql
    const totalSql = 'select count(*) as total from app_config ' + whereSql;

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
