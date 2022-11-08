<template>
    <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="background: #fff; padding: 0">
            <div class="logo">
                <span>API自动化测试</span>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="light" mode="inline">
                <template v-for="route of menuRoutes[0].children">
                    <RouteMenu :route="route" />
                </template> 
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
               <div class="header">
                    <span class="header_left">
                        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                    </span>
                    <span class="header_right">
                        <a-dropdown placement="bottomRight">
                            <a class="ant-dropdown-link" @click.prevent>
                                <a-avatar style="background-color: #87d068">
                                    <template #icon>
                                        <user-outlined />
                                    </template>
                                </a-avatar>
                            </a>
                            <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a href="javascript:;" @click="goToPersonelCenter">个人中心</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;" @click="onUpdatePwdClick">修改密码</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a href="javascript:;" @click="handleLogout">退出登录</a>
                                </a-menu-item>
                            </a-menu>
                            </template>
                        </a-dropdown>
                    </span>
               </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '16px 12px', padding: '12px', background: '#fff', minHeight: '850px' }">
                <router-view></router-view>
            </a-layout-content>
            <a-layout-footer style="text-align: center; height: 80px;">
                API自动化测试平台 <a href="http://localhost:3000/swagger" target="_blank" >v1.0.0</a>，github地址：<a href="https://github.com/PactStart/api_auto_test_platform" target="_blank">https://github.com/PactStart/api_auto_test_platform</a>
            </a-layout-footer>
        </a-layout>
    </a-layout>
    <a-modal v-model:visible="showUpdatePwdModal" title="重置密码" @ok="handleUpdatePwd" ok-text="提交"
        cancel-text="取消">
        <a-form :model="updatePwdForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
            <a-form-item label="密码" name="oldPassword" :rules="[{ required: true, message: 'Please input oldPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.oldPassword" />
            </a-form-item>
            <a-form-item label="新密码" name="newPassword" :rules="[{ required: true, message: 'Please input newPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.newPassword" />
            </a-form-item>

            <a-form-item label="确认新密码" name="confirmNewPassword"
                :rules="[{ required: true, message: 'Please input confirmNewPassword!' }]">
                <a-input-password v-model:value="updatePwdForm.confirmNewPassword" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup>
import {logout,getUserInfo, updatePwd}  from '@/api/user';
import router from '@/router';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import {ref ,onMounted } from 'vue';
import RouteMenu from "../components/RouteMenu.vue";
import menuRoutes from "../router/home";

const selectedKeys = ref(['app']);
const openKeys = ref(['sys','app','test']);
const collapsed = ref(false);

onMounted(() => {
    getUserInfo((res) => {
        if(!res.code) {
            console.log(res.data);
        }
    })
});

const handleLogout = () => {
    logout({}).then(res => {
        if(!res.code) {
            message.success('退出成功');
            localStorage.removeItem('token');
            router.push('/login');
        }
    })
};

const showUpdatePwdModal = ref(false);
const updatePwdForm = ref({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
});

const onUpdatePwdClick = () => {
    showUpdatePwdModal.value = true;
};

const handleUpdatePwd = () => {
    if(updatePwdForm.value.newPassword != updatePwdForm.value.confirmNewPassword) {
        message.error('')
    }
    updatePwd({
        ...updatePwdForm.value
    }).then(res => {
        if(!res.code) {
            message.success('修改密码成功');
            showUpdatePwdModal.value = false;
        }
    })
}
const goToPersonelCenter = () => {
    router.push('/sys/user/personnel_center');
};
</script>
<style lang='less' scoped>
.logo {
    height: 32px;
    margin: 16px;
    background: #fff;
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}

.header {
    position: relative;
    .header_left {
        float: left;
    }
    .header_right {
        float: right;
        margin-right: 32px;
    }
}
.header::after {
    content: ".";
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
    clear: both;
    overflow: hidden;
}
</style>