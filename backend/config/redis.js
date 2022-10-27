const { createClient } = require('redis');

const client = createClient({
    url: 'redis://127.0.0.1:6379',
    password: '123456'
});
client.on('connect', function() {
    console.debug('Redis client connected');
});
client.on('error', (err) => console.log('Redis Client Error', err));


async function hSet(key, hashKey, hashValue) {
    await client.connect();
    await client.hSet(key,hashKey, hashValue);
}

async function hExists(key,field) {
    await client.connect();
    return await client.hExists(key,field);
}

async function sAdd(key,members) {
    await client.connect();
    await client.sAdd(key,members);
}

async function sIsMember(key,member) {
    await client.connect();
    const value = await client.sIsMember(key,member);
    return value;
}

async function sMembers(key) {
    await client.connect();
    return await client.sMembers(key);
}

async function deleteKey(key) {
    await client.connect();
    return await client.del(key);
}

module.exports = {client,hSet,hExists,sAdd,sIsMember,sMembers};