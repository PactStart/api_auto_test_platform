import request from "../utils/request";

/**
 * 查询应用
 */
 export const addApp = (data) => {
  return request({ method: "post", url: "/api/v1/app/add", data });
};

/**
 * 查询应用
 */
 export const queryApp = (data) => {
  return request({ method: "get", url: "/api/v1/app/query", data });
};

/**
 * 修改应用
 */
 export const updateApp = (data) => {
  return request({ method: "post", url: "/api/v1/app/update", data });
};

/**
 * 删除应用
 */
 export const deleteApp = (data) => {
  return request({ method: "post", url: "/api/v1/app/delete", data });
};
