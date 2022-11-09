function parseApi(groupName, apiDocObj) {
  let apiArr = [];
  const basePath = apiDocObj.basePath;
  const paths = apiDocObj.paths;
  for (const key in paths) {
    if (Object.hasOwnProperty.call(paths, key)) {
      const pathObj = paths[key];
      const apiUrl = basePath == "/" ? key : basePath + key;
      const requestMethod = Object.keys(pathObj)[0];

      const apiDescObj = pathObj[requestMethod];
      const apiName = apiDescObj["summary"];

      let contentType = "";
      if (apiDescObj["consumes"]) {
        contentType = apiDescObj["consumes"][0];
      }
      if (!contentType && requestMethod.toLocaleLowerCase() == "post") {
        contentType = "application/json";
      }

      let moduleName = "默认模块";
      if (apiDescObj["tags"]) {
        moduleName = apiDescObj["tags"][0];
      }

      let headers = [];
      let query = [];
      let bodyParams = [];
      if (apiDescObj["parameters"]) {
        headers = apiDescObj["parameters"].filter(
          (item) => item["in"] == "header"
        );
        query = apiDescObj["parameters"].filter(
          (item) => item["in"] == "query"
        );
        bodyParams = apiDescObj["parameters"].filter(
          (item) => item["in"] != "body"
        );
      }
      let body = {};
      if (bodyParams && bodyParams.length) {
        bodyParam = bodyParams[0];
        if (bodyParam["schema"] && bodyParam["schema"]["$ref"]) {
          const ref = bodyParam["schema"]["$ref"];
          pathArr = ref.substring(2).split("/");
          let targetObj = apiDocObj;
          let index = 0;
          for (; index < pathArr.length; index++) {
            const path = pathArr[index];
            if (targetObj[path]) {
              targetObj = targetObj[path];
            } else {
              break;
            }
          }
          if (index == pathArr.length) {
            body = targetObj;
          }
        }
      }
      let bodySchemaPathArr = [
        "requestBody",
        "content",
        "application/json",
        "schema",
      ];
      let cursorObj = apiDescObj;
      let index = 0;
      for (; index < bodySchemaPathArr.length; index++) {
        const name = bodySchemaPathArr[index];
        if (cursorObj[name]) {
          cursorObj = cursorObj[name];
        } else {
          break;
        }
      }
      if (index == bodySchemaPathArr.length) {
        body = cursorObj;
      }

      apiObj = {
        groupName,
        moduleName,
        apiName,
        apiUrl,
        requestMethod,
        contentType,
        headers,
        query,
        body,
      };
      apiArr.push(apiObj);
    }
  }
  return apiArr;
}

function parseApiTree(groupName, apiDocObj) {
  const apiArr = parseApi(groupName, apiDocObj);
  let moduleMap = new Map();
  apiArr.forEach((api) => {
    let subApiArr = [];
    if (moduleMap.has(api.moduleName)) {
      subApiArr = moduleMap.get(api.moduleName);
    }
    subApiArr.push(api);
    moduleMap.set(api.moduleName, subApiArr);
  });
  let moduleArr = [];
  for (let entry of moduleMap.entries()) {
    moduleArr.push({
      moduleName: entry[0],
      description: entry[0],
      children: entry[1],
    });
  }
  return moduleArr;
}

module.exports = { parseApi, parseApiTree };
