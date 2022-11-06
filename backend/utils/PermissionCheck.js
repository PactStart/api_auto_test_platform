const joi = require("joi");

const id = joi.number().integer().required();
const parentId = joi.number().integer();
const type = joi.string().required();
const anon = joi.number().integer().min(0).max(1);
const login = joi.number().integer().min(0).max(1);
const name = joi.string().required();
const description = joi.string().required();
const internal = joi.number().integer().min(0).max(1);
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
    internal,
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
    internal,
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
    type: joi.string().allow(null, ''),
    internal,
    name: joi.string().allow(null, ''),
    page,
    size,
  },
};

exports.apiPermsImportCheck = {
  body: {
    url: joi.string().required(),
  },
};
