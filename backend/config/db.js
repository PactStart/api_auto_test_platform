const mysql = require('mysql');

const zeroBuffer = Buffer.from([0x00]);

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'auto_test',
    debug: false,
    typeCast: function (field, next) {
        // https://github.com/mysqljs/mysql#type-casting
        // bit 转 boolean
        if (field.type === 'BIT' && field.length === 1) {
            //取2个buffer的第1位比较
            if(field.buffer() == null) {
                return null;
            }
            try {
                return field.buffer().compare(zeroBuffer,0,1) > 0;
            } catch (error) {
                console.log(field.name)
                return true;
            }
           
        } else {
            return next();
        }
    }
});

 module.exports = db;