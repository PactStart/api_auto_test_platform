<template>
  <a-descriptions title="个人信息" bordered>
    <a-descriptions-item label="用户名">{{user.username}}</a-descriptions-item>
    <a-descriptions-item label="手机号">{{user.phone}}</a-descriptions-item>
    <a-descriptions-item label="邮箱">{{user.email}}</a-descriptions-item>
    <a-descriptions-item label="昵称">{{user.nickname}}</a-descriptions-item>
    <a-descriptions-item label="最近登录时间">{{formatTimestamp(user.lastLoginTime)}}</a-descriptions-item>
    <a-descriptions-item label="最近登录ip">{{user.lastLoginIp}}</a-descriptions-item>
    <a-descriptions-item label="超级管理员" :span="3">
      <span v-if="user.superAdmin">是</span>
      <span v-else>否</span>
    </a-descriptions-item>
    <a-descriptions-item label="角色" :span="3">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
    </a-descriptions-item>
    <a-descriptions-item label="API权限" :span="3">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
    </a-descriptions-item>
    <a-descriptions-item label="按钮权限" :span="3">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
    </a-descriptions-item>
  </a-descriptions>
</template>
<script setup>
import { getUserInfo } from '@/api/user';
import { ref, onMounted } from 'vue';
import { formatTimestamp } from '@/utils/time';
const user = ref({});
onMounted(() => {
  getUserInfo({}).then((res) => {
    if (!res.code) {
      user.value = res.data.user;
    }
  })
});
</script>