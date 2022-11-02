import request from "../utils/request";
/**
 * 登录接口
 */
export const login = (data) => {
  return request({ method: "post", url: "/api/v1/user/login", data });
};

/**
 * 获取用户信息接口
 */
export const getUserInfo = () => {
  return request({ method: "get", url: "/api/v1/user/userInfo" });
};

/**
 * 查询用户
 */
 export const addUser = (data) => {
  return request({ method: "post", url: "/api/v1/user/add", data });
};

/**
 * 查询用户
 */
 export const queryUser = (data) => {
  return request({ method: "get", url: "/api/v1/user/query", data });
};

/**
 * 修改用户
 */
 export const updateUser = (data) => {
  return request({ method: "post", url: "/api/v1/user/update", data });
};

/**
 * 删除用户
 */
 export const deleteUser = (data) => {
  return request({ method: "post", url: "/api/v1/user/delete", data });
};

/**
 * 重置密码
 */
 export const resetPwd = (data) => {
  return request({ method: "post", url: "/api/v1/user/resetPwd", data });
};