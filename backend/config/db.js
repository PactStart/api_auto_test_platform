const mysql = require("mysql");

const zeroBuffer = Buffer.from([0x00]);

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "api_auto_test",
  debug: false,
  typeCast: function (field, next) {
    // console.log(field.type,field.length)
    // https://github.com/mysqljs/mysql#type-casting
    return next();
  },
});

module.exports = db;
