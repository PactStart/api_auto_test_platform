import request from "../utils/request";

/**
 * 查询API
 */
 export const addApi = (data) => {
  return request({ method: "post", url: "/api/v1/api/add", data });
};

/**
 * 查询API
 */
 export const queryApi = (data) => {
  return request({ method: "get", url: "/api/v1/api/query", data });
};

/**
 * 修改API
 */
 export const updateApi = (data) => {
  return request({ method: "post", url: "/api/v1/api/update", data });
};

/**
 * 删除API
 */
 export const deleteApi = (data) => {
  return request({ method: "post", url: "/api/v1/api/delete", data });
};

/**
 * 导入API
 */
 export const importApi = (data) => {
    return request({ method: "post", url: "/api/v1/api/import", data });
  };
