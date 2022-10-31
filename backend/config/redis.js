const { createClient } = require("redis");

const client = createClient({
  url: "redis://127.0.0.1:6379",
  password: "123456",
});
client.on("connect", function () {
  console.debug("Redis client connected");
});
client.on("error", (err) => console.log("Redis Client Error", err));

async function connect() {
  await client.connect();
}

async function hSet(key, hashKey, hashValue) {
  await client.hSet(key, hashKey, hashValue);
}

async function hDel(key, hashKey) {
  await client.hDel(key, hashKey);
}

async function hGet(key, hashKey) {
  await client.hGet(key, hashKey);
}

async function hExists(key, field) {
  return await client.hExists(key, field);
}

async function sAdd(key, members) {
  await client.sAdd(key, members);
}

async function sIsMember(key, member) {
  const value = await client.sIsMember(key, member);
  return value;
}

async function sMembers(key) {
  return await client.sMembers(key);
}

async function deleteKey(key) {
  return await client.del(key);
}

module.exports = {
  connect,
  hSet,
  hDel,
  hGet,
  hExists,
  sAdd,
  sIsMember,
  sMembers,
};
