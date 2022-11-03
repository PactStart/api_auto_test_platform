import request from "../utils/request";

/**
 * 查询应用配置
 */
 export const addAppConfig = (data) => {
  return request({ method: "post", url: "/api/v1/appConfig/add", data });
};

/**
 * 查询应用配置
 */
 export const queryAppConfig = (data) => {
  return request({ method: "get", url: "/api/v1/appConfig/query", data });
};

/**
 * 修改应用配置
 */
 export const updateAppConfig = (data) => {
  return request({ method: "post", url: "/api/v1/appConfig/update", data });
};

/**
 * 删除应用配置
 */
 export const deleteAppConfig = (data) => {
  return request({ method: "post", url: "/api/v1/appConfig/delete", data });
};
