const joi = require("joi");

const id = joi.number().integer().required();
const parentId = joi.number().integer();
const type = joi.string().required();
const anon = joi.bool();
const login = joi.bool();
const name = joi.string().required();
const description = joi.string().required();
const internel = joi.bool();
const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.permissionAddCheck = {
  body: {
    parentId,
    type,
    anon,
    login,
    name,
    description,
    internel,
  },
};

exports.permissionUpdateCheck = {
  body: {
    id,
    parentId,
    type,
    anon,
    login,
    name,
    description,
    internel,
  },
};

exports.permissionDeleteCheck = {
  body: {
    id,
  },
};

exports.permissionQueryCheck = {
  query: {
    anon,
    login,
    type: joi.string(),
    internel,
    name: joi.string(),
    page,
    size,
  },
};

exports.apiPermsImportCheck = {
  body: {
    url: joi.string().required(),
  },
};
