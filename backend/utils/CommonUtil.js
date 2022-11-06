/**
 * 将驼峰转为下划线
 */
function camelCaseToUnderline(key) {
  return key.replace(/([A-Z])/g, (res) => "_" + res.toLowerCase());
}

/**
 * 下划线转小驼峰
 */
function underlineToCamelCase(key) {
  return key.replace(/_([a-z])/g, (res) => res[1].toUpperCase());
}

/**
 * 生成where条件sql
 * @param {*} obj
 * @param {*} fields
 * @param {*} likeFields
 * @returns
 */
function generateWhereSql(obj, fields, likeFields) {
  let whereSql = " where ";
  let values = [];
  for (let index = 0; index < fields.length; index++) {
    const key = fields[index];
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (value != null && value != '') {
        if (likeFields.indexOf(key) != -1) {
          whereSql = whereSql + ` ${camelCaseToUnderline(key)} like ? and `;
          values.push("%" + value + "%");
        } else {
          whereSql = whereSql + ` ${camelCaseToUnderline(key)} = ? and `;
          values.push(value);
        }
      }
    }
  }
  whereSql = whereSql + "del = 0";
  return {
    whereSql,
    values,
  };
}

function convertKeyToCamelCase(data) {
  if (typeof data !== "object" || !data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => convertKeyToCamelCase(item));
  }

  let newObj = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      let newKey = key.replace(/_([a-z])/g, (res) => res[1].toUpperCase());
      newObj[newKey] = convertKeyToCamelCase(data[key]);
    }
  }
  return newObj;
}

function convertKeyToUnderline(data) {
  if (typeof data !== "object" || !data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => convertKeyToUnderline(item));
  }

  let newObj = {};
  for (let key in data) {
    let newKey = key.replace(/([A-Z])/g, (res) => {
      return "_" + res.toLowerCase();
    });
    newObj[newKey] = convertKeyToUnderline(data[key]);
  }
  return newObj;
}

function recursionFindAll(map, array) {
  let result = [];
  if (array == null || array.length == 0) {
    return result;
  }
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (map.has(element)) {
      result.push(element);
    }
  }
  let subResult = recursionFindAll(map, result);
  result.push(subResult);
  return result;
}

function recursionFindAllNonredundant(map, array) {
  let result = recursionFindAll(map, array);
  return Array.from(new Set(result));
}

module.exports = {
  camelCaseToUnderline,
  underlineToCamelCase,
  generateWhereSql,
  convertKeyToCamelCase,
  convertKeyToUnderline,
  recursionFindAllNonredundant,
};
