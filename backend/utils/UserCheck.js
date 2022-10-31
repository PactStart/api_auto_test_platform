const joi = require("joi");

//用户登录表单校验规则
const username = joi
  .string()
  .pattern(new RegExp("^[a-zA-Z0-9]{5,20}$"))
  .required();
const password = joi
  .string()
  .pattern(new RegExp("^[a-zA-Z0-9]{6,20}$"))
  .required();
const id = joi.number().integer().required();
const nickname = joi.string().required();
const email = joi.string().email();
const phone = joi.string().pattern(new RegExp("^[0-9]{11}$"));
const keyword = joi.string();
const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();
exports.userLoginCheck = {
  body: {
    username,
    password,
  },
};

exports.userResetPwdCheck = {
  body: {
    oldPassword: password,
    newPassword: password,
  },
};

exports.userAddCheck = {
  body: {
    username,
    password,
    nickname,
  },
};

exports.userDeleteCheck = {
  body: {
    id,
  },
};

exports.userUpdateCheck = {
  body: {
    id,
    email,
    phone,
  },
};

exports.userQueryCheck = {
  query: {
    keyword,
    page,
    size,
  },
};
