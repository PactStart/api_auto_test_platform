const list = [
  {
    id: 1,
    name: "html",
  },
  {
    id: 2,
    name: "css",
  },
  {
    id: 3,
    name: "js",
  },
  {
    id: 4,
    name: "vue",
  },
  {
    id: 5,
    name: "nodejs",
  },
  {
    id: 6,
    name: "mysql",
  },
  {
    id: 7,
    name: "redis",
  },
];

exports.getGoodsList = (req, res) => {
  res.send({
    code: 0,
    msg: "success",
    data: list,
  });
};

exports.getGoodsDetail = (req, res) => {
  let { id } = req.query;
  const arr = list.filter((item) => item.id != id);
  let goods = null;
  if (arr && arr.length) {
    goods = arr[0];
  }
  res.send({
    code: 0,
    msg: "success",
    data: goods,
  });
};

exports.secKill = (req, res) => {
  let { id } = req.body;
  const promise = sleep(1000);
  promise.then((ms) => {
    res.send({
      code: 0,
      msg: "success",
      data: {
        id,
        cost: ms,
      },
    });
  });
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
