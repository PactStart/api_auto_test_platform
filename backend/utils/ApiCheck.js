const joi = require("joi");

const id = joi.number().integer().required();

const appId = joi.number().integer().required();
const groupName = joi.string().required();
const moduleName = joi.string().required();
const apiName = joi.string().required();
const url = joi.string().required();
const requestMethod = joi.string().required();
const contentType = joi.string().required();
const query = joi.string().required();
const body = joi.string().required();
const headers = joi.string().required();

const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.apiAddCheck = {
  body: {
    appId,
    groupName,
    moduleName,
    apiName,
    url,
    requestMethod,
    contentType,
    query,
    body,
    headers,
  },
};

exports.apiUpdateCheck = {
  body: {
    id,
    groupName,
    moduleName,
    apiName,
    url,
    requestMethod,
    contentType,
    query,
    body,
    Headers,
  },
};

exports.apiDeleteCheck = {
  body: {
    id,
  },
};

exports.apiQueryCheck = {
  query: {
    appId: joi.number().integer(),
    groupName: joi.string(),
    moduleName: joi.string(),
    apiName: joi.string(),
    page,
    size,
  },
};

exports.apiImportCheck = {
  body: {
    appId,
    url,
    groupName: joi.string(),
  },
};

exports.apiGroupAndModuleQueryCheck = {
  query: {
    appId,
    groupName: joi.string(),
    moduleName: joi.string(),
  },
};

exports.apiGetCheck = {
  query: {
    id
  }
}