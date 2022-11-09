import request from "../utils/request";

/**
 * 查询权限
 */
 export const addPermission = (data) => {
  return request({ method: "post", url: "/api/v1/permission/add", data });
};

/**
 * 查询权限
 */
 export const queryPermission = (data) => {
  return request({ method: "get", url: "/api/v1/permission/query", data });
};

/**
 * 修改权限
 */
 export const updatePermission = (data) => {
  return request({ method: "post", url: "/api/v1/permission/update", data });
};

/**
 * 删除权限
 */
 export const deletePermission = (data) => {
  return request({ method: "post", url: "/api/v1/permission/delete", data });
};

/**
 * 导入API权限
 */
 export const importApiPerms = (data) => {
  return request({ method: "post", url: "/api/v1/permission/importApiPerms", data });
};

/**
 * 导入页面权限
 */
 export const importPagePerms = (data) => {
  return request({ method: "post", url: "/api/v1/permission/importPagePerms", data });
};
