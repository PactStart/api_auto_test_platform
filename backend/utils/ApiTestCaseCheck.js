const joi = require("joi");

const id = joi.number().integer().required();

const appId = joi.number().integer().required();
const apiId = joi.number().integer().required();
const name = joi.string().required();
const run = joi.bool();
const headers = joi.string();
const preCaseId = joi.number().integer().integer();
const preFields = joi.string();
const requestBody = joi.string();
const assert = joi.string().required();

const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.apiTestCaseAddCheck = {
  body: {
    appId,
    apiId,
    name,
    run,
    headers,
    preCaseId,
    preFields,
    requestBody,
    assert,
  },
};

exports.apiTestCaseDeleteCheck = {
  body: {
    id,
    name,
    run,
    headers,
    preCaseId,
    preFields,
    requestBody,
    assert,
  },
};

exports.apiTestCaseQueryCheck = {
  query: {
    appId: joi.number().integer(),
    apiId: joi.number().integer(),
    name: joi.string().allow(null,''),
    run,
    page,
    size,
  },
};

exports.apiTestCaseCreateDefaultCheck = {
  body: {
    id,
  },
};

exports.apiTestCaseCreateDefaultForAllCheck = {
  body: {
    appId,
  },
};

exports.apiTestCaseBatchSetPreCaseCheck = {
  body: {
    appId,
    preCaseId,
  },
};
