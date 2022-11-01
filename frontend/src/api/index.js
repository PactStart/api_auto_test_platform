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
