<template>
    <div class="login_form">
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
            @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="用户名" name="username"
                :rules="[{ required: true, message: 'Please input your username!' }]">
                <a-input v-model:value="formState.username" />
            </a-form-item>

            <a-form-item label="密码" name="password"
                :rules="[{ required: true, message: 'Please input your password!' }]">
                <a-input-password v-model:value="formState.password" />
            </a-form-item>

            <a-form-item name="记住我" :wrapper-col="{ offset: 8, span: 16 }">
                <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" html-type="submit">登录</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { defineComponent, reactive } from 'vue';
import { login } from '../api/index'
import { router } from '../router/index';
import { message } from 'ant-design-vue';

export default defineComponent({
    setup() {
        const formState = reactive({
            username: 'admin',
            password: '123456',
            remember: true,
        });

        const onFinish = values => {
            login(values).then(res => {
                console.log('Success:', res);
                if (res?.token) {
                    localStorage.setItem('token', res?.token)
                    message.success('登录成功')
                    router.push('/home')
                }
            })
        };
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        return {
            formState,
            onFinish,
            onFinishFailed,
        };
    },

});
</script>
<style lang='less' scoped>
    .login_form {
        
    }
</style>