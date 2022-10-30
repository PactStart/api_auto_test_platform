const db = require("../config/db");
const {hSet,hDel,hGet} = require('../config/redis');

const API_PERM_KEY = 'sys:perm:api';
exports.loadPermCache = () => {
    selectSql = 'select * from sys_permission where type = ? and del = 0';
    db.query(selectSql,'API',(err,results) => {
        if(err) {
            console.log('加载API权限失败',err)
            return;
        }
        console.log('加载API权限' + results.length + '条');
        if(results && !results.length) {
            for (const item of results) {
                const promise = hSet(API_PERM_KEY,perm.url,JSON.stringify(item))
                promise.then(res => {
                    console.log('同步缓存成功:' + perm.url);
                })
            }
        }
    })

}

exports.refreshPermCache = id => {
    selectSql = 'select * from sys_permission where id = ? and type = ? and del = 0';
    db.query(selectSql,[id,'API'],(err,results) => {
        if(err) {
            console.log('加载API权限失败',err)
            return;
        }
        if(results && !results.length) {
            for (const item of results) {
                hSet(API_PERM_KEY,perm.url,JSON.stringify(item))
            }
        }
    })
    hSet(API_PERM_KEY,perm.url);
}

exports.removePermCache = url => {
    hDel(API_PERM_KEY,url);
    
}

exports.getPermCache = url => {
    const value = hGet(API_PERM_KEY,url);
    if(!value) {
        return null;
    }
    return JSON.parse(value);
}