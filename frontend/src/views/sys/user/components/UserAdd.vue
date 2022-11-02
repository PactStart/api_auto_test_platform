<template>
<div>
    <a-form :model="userForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
        @finish="onSubmit" @finishFailed="onFinishFailed">
        <a-form-item label="用户名" name="username"
            :rules="[{ required: true, message: 'Please input username!' }]">
            <a-input v-model:value="userForm.username" />
        </a-form-item>

        <a-form-item label="密码" name="password"
            :rules="[{ required: true, message: 'Please input password!' }]">
            <a-input-password v-model:value="userForm.password" />
        </a-form-item>

        <a-form-item label="昵称" name="nickname"
            :rules="[{ required: true, message: 'Please input nickname!' }]">
            <a-input v-model:value="userForm.nickname" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
            <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
    </a-form>
</div>
</template>
<script>
    import { reactive } from 'vue';
    export default {
        props:["onSubmit"],
        setup() {
            const userForm = reactive({
                username: '',
                password: '',
                nickname: '',
            });
            const onFinishFailed = errorInfo => {
                console.log('Failed:', errorInfo);
            };
            return {
                userForm,
                onFinishFailed
            }
        }
    }
</script>
<style lang='less' scoped>

</style>