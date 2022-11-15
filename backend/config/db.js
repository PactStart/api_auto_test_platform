const mysql = require("mysql");

const zeroBuffer = Buffer.from([0x00]);

const db = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "123456",
  database: process.env.MYSQL_DATABASE || "api_auto_test",
  debug: false,
  typeCast: function (field, next) {
    // console.log(field.type,field.length)
    // https://github.com/mysqljs/mysql#type-casting
    return next();
  },
});

module.exports = db;
