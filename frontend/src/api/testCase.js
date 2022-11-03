import request from "../utils/request";

/**
 * 查询测试用例
 */
 export const addTestCase = (data) => {
  return request({ method: "post", url: "/api/v1/testCase/add", data });
};

/**
 * 查询测试用例
 */
 export const queryTestCase = (data) => {
  return request({ method: "get", url: "/api/v1/testCase/query", data });
};

/**
 * 修改测试用例
 */
 export const updateTestCase = (data) => {
  return request({ method: "post", url: "/api/v1/testCase/update", data });
};

/**
 * 删除测试用例
 */
 export const deleteTestCase = (data) => {
  return request({ method: "post", url: "/api/v1/testCase/delete", data });
};


/**
 * 批量为应用接口创建默认用例
 */
 export const createDefaultForAll = (data) => {
  return request({ method: "post", url: "/api/v1/testCase/createDefaultForAll", data });
};



/**
 * 批量设置前置用例
 */
 export const bactchSetPreCase = (data) => {
  return request({ method: "post", url: "/api/v1/testCase/createDefaultForAll", data });
};
