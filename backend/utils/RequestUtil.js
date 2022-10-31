const request = require("request");
const { parseApi } = require("./SwaggerParser");

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    ""
  );
}

async function requestSwaggerApi(url, groupName, apiArr) {
  return new Promise((resolve) => {
    request(
      {
        uri: url,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
      (err, response, body) => {
        if (err || response.statusCode != 200) {
          console.log(err, response.statusCode);
          throw new Error("api读取失败:" + url);
        }
        let obj = JSON.parse(body);

        let groupNum;
        if (obj instanceof Array) {
          groupNum = obj.length;
          const promiseArr = [];
          for (let index = 0; index < obj.length; index++) {
            const fullGroupUrl = new URL(url).origin + obj[index].url;
            const groupName = obj[index].name;
            const promise = requestSwaggerApi(fullGroupUrl, groupName, apiArr);
            promiseArr.push(promise);
          }
          Promise.all(promiseArr).then(function () {
            resolve(groupNum);
          });
        } else if (Object.hasOwnProperty.call(obj, "paths")) {
          groupNum = 1;
          const subApiArr = parseApi(groupName, obj);
          apiArr.push(...subApiArr);
          console.log(
            `url: ${url} 解析出api ${subApiArr.length}条,合计${apiArr.length}条`
          );
          resolve(groupNum);
        } else {
          throw new Error("api解析paths字段失败:" + url);
        }
      }
    );
  });
}

module.exports = { getClientIp, requestSwaggerApi };
