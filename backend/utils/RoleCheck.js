const joi = require("joi");

const id = joi.number().integer().required();
const name = joi.string().required();
const description = joi.string().allow(null, '')
const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();
const roleId = joi.number().integer().required();
const permissionIds = joi.array().items(joi.number()).required();
const userIds = joi.array().items(joi.number()).required();

exports.roleAddCheck = {
  body: {
    name,
    description,
  },
};

exports.roleUpdateCheck = {
  body: {
    id,
    name,
    description,
  },
};

exports.roleDeleteCheck = {
  body: {
    id,
  },
};

exports.roleQueryCheck = {
  query: {
    name: joi.string().allow(null, ''),
    page,
    size,
  },
};

exports.rolePermissionsCheck = {
  body: {
    roleId,
    permissionIds,
  },
};

exports.roleIdCheck = {
  query: {
    roleId,
    page,
    size,
  },
};

exports.roleUsersCheck = {
  body: {
    roleId,
    userIds,
  },
};
