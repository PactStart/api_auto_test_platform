<template>
    <div class="login_form">
        <a-card title="欢迎登录API自动化测试平台" style="width: 500px; height: 300px;">
            <a-form :model="loginForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="用户名" name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]">
                <a-input v-model:value="loginForm.username" />
            </a-form-item>

            <a-form-item label="密码" name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="loginForm.password" />
            </a-form-item>

            <a-form-item name="记住我" :wrapper-col="{ offset: 4, span: 20 }">
                <a-checkbox v-model:checked="loginForm.remember">Remember me</a-checkbox>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">登录</a-button>
            </a-form-item>
        </a-form>
        </a-card>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { login } from '../api/user'
import router from '../router/index';
import { message } from 'ant-design-vue';

export default defineComponent({
    setup() {
        const loginForm = reactive({
            username: 'admin',
            password: '123456',
            remember: true,
        });

        const onFinish = values => {
            login(values).then(res => {
                if (res?.data?.token) {
                    localStorage.setItem('token', res?.data?.token)
                    message.success('登录成功')
                    router.push('/app/app')
                }
            })
        };
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return {
            loginForm,
            onFinish,
            onFinishFailed,
        };
    },

});
</script>
<style lang='less' scoped>
    .login_form {
        position: absolute;
        background-color: green;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-60%);
    }
</style>