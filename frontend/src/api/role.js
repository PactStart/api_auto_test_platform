import request from "../utils/request";

/**
 * 查询角色
 */
 export const addRole = (data) => {
  return request({ method: "post", url: "/api/v1/role/add", data });
};

/**
 * 查询角色
 */
 export const queryRole = (data) => {
  return request({ method: "get", url: "/api/v1/role/query", data });
};

/**
 * 修改角色
 */
 export const updateRole = (data) => {
  return request({ method: "post", url: "/api/v1/role/update", data });
};

/**
 * 删除角色
 */
 export const deleteRole = (data) => {
  return request({ method: "post", url: "/api/v1/role/delete", data });
};

/**
 * 角色设置权限
 */
 export const assignPermissions = (data) => {
  return request({ method: "post", url: "/api/v1/role/assignPermissions", data });
};

/**
 * 角色绑定权限
 */
 export const bindPermissions = (data) => {
  return request({ method: "post", url: "/api/v1/role/bindPermissions", data });
};


/**
 * 角色移除权限
 */
 export const unbindPermissions = (data) => {
  return request({ method: "post", url: "/api/v1/role/unbindPermissions", data });
};


/**
 * 列出角色的所有权限
 */
 export const listPermissions = (data) => {
  return request({ method: "get", url: "/api/v1/role/listPermissions", data });
};

/**
 * 列出角色的权限树
 */
export const listPermissionTree = (data) => {
  return request({ method: "get", url: "/api/v1/role/listPermissionTree", data });
};

/**
 * 角色授权给用户
 */
 export const assignUsers = (data) => {
  return request({ method: "post", url: "/api/v1/role/assignUsers", data });
};

/**
 * 角色绑定用户
 */
 export const bindUsers = (data) => {
  return request({ method: "post", url: "/api/v1/role/bindUsers", data });
};

/**
 * 角色解绑用户
 */
 export const unbindUsers = (data) => {
  return request({ method: "post", url: "/api/v1/role/unbindUsers", data });
};


/**
 * 列出角色的所有用户
 */
 export const listUsers = (data) => {
  return request({ method: "get", url: "/api/v1/role/listUsers", data });
};