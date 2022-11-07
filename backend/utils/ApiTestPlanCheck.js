const joi = require("joi");

const id = joi.number().integer().required();

const appId = joi.number().integer().required();
const chooseAllCase = joi.bool().required();
const caseIds = joi.array().items(joi.number());
const baseUrl = joi.string().required();
const name = joi.string().required();

const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.apiTestPlanAddCheck = {
  body: {
    appId,
    chooseAllCase,
    caseIds,
    baseUrl,
    name,
  },
};

exports.apiTestPlanIdCheck = {
  body: {
    id,
  },
};

exports.apiTestPlanQueryCheck = {
  query: {
    appId: joi.number().integer(),
    name: joi.string(),
    page,
    size,
  },
};

exports.apiTestPlanRunLogQueryCheck = {
  query: {
    planId: joi.number().integer(),
    groupName: joi.string().allow(null,''),
    moduleName: joi.string().allow(null,''),
    apiName: joi.string().allow(null,''),
    caseName: joi.string().allow(null,''),
    pass: joi.bool(),
    page,
    size,
  },
};
