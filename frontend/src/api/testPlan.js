import request from "../utils/request";

/**
 * 查询测试计划
 */
 export const addTestPlan = (data) => {
  return request({ method: "post", url: "/api/v1/testPlan/add", data });
};

/**
 * 查询测试计划
 */
 export const queryTestPlan = (data) => {
  return request({ method: "get", url: "/api/v1/testPlan/query", data });
};

/**
 * 获取测试计划
 */
 export const getTestPlan = (data) => {
  return request({ method: "post", url: "/api/v1/testPlan/getById", data });
};

/**
 * 删除测试计划
 */
 export const deleteTestPlan = (data) => {
  return request({ method: "post", url: "/api/v1/testPlan/delete", data });
};

/**
 * 查看测试报告
 */
 export const queryRunLog = (data) => {
  return request({ method: "get", url: "/api/v1/testPlan/queryRunLog", data });
};