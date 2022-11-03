const joi = require("joi");

const id = joi.number().integer().required();
const appId = joi.number().integer().required();
const configKey = joi.string().required();
const configValue = joi.string().required();
const description = joi.string().required();
const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.appConfigAddCheck = {
  body: {
    appId,
    configKey,
    configValue,
    description,
  },
};

exports.appConfigUpdateCheck = {
  body: {
    appId,
    configKey,
    configValue,
    description
  },
};

exports.appConfigDeleteCheck = {
  body: {
    id,
  },
};

exports.appConfigQueryCheck = {
  query: {
    appId: joi.number().integer(),
    configKey: joi.string(),
    page,
    size,
  },
};
