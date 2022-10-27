function parseApi(groupName, apiDocObj) {
    let apiArr = [];
    const basePath = apiDocObj.basePath;
    const paths = apiDocObj.paths;
    for (const key in paths) {
        if (Object.hasOwnProperty.call(paths, key)) {
            const pathObj = paths[key];
            const apiUrl = basePath == '/' ? key : basePath + key;
            const requestMethod = Object.keys(pathObj)[0];

            const apiDescObj = pathObj[requestMethod];
            const apiName = apiDescObj['summary'];

            let contentType = '';
            if(apiDescObj["consumes"]) {
                contentType = apiDescObj["consumes"][0];
            } else {
                if(!contentType && requestMethod.toLocaleLowerCase() == 'post') {
                    contentType = 'application/json';
                }
            }
            let moduleName = '默认模块';
            if(apiDescObj["tags"]) {
                moduleName = apiDescObj["tags"][0];
            }
            apiObj = {
                groupName,
                moduleName,
                apiName,
                apiUrl,
                requestMethod,
                contentType
            };
            apiArr.push(apiObj);
        }
    }
    return apiArr;
}

function parseApiTree(groupName, apiDocObj) {
    const apiArr = parseApi(groupName, apiDocObj);
    let moduleMap = new Map();
    apiArr.forEach(api => {
        let subApiArr = [];
        if(moduleMap.has(api.moduleName)) {
            subApiArr = moduleMap.get(api.moduleName);
        }
        subApiArr.push(api);
        moduleMap.set(api.moduleName,subApiArr);
    })
    let moduleArr = [];
    for(let entry of moduleMap.entries()) {
        moduleArr.push({
            name: groupName + '-' + entry[0],
            description: entry[0],
            children: entry[1]
        })
    }
    return moduleArr;
}

module.exports = {parseApi,parseApiTree}