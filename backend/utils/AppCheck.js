const joi = require("joi");

const id = joi.number().integer().required();
const name = joi.string().required();
const page = joi.number().integer().min(1).required();
const size = joi.number().integer().min(1).max(100).required();

exports.appAddCheck = {
  body: {
    name,
  },
};

exports.appUpdateCheck = {
  body: {
    id,
    name,
  },
};

exports.appDeleteCheck = {
  body: {
    id,
  },
};

exports.appQueryCheck = {
  query: {
    name: joi.string(),
    page,
    size,
  },
};
