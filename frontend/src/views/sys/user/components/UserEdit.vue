<template>
    <div>
        <a-form :model="userForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onSubmit(userForm)" @finishFailed="onFinishFailed">
            <a-form-item label="邮箱" name="email"
                :rules="[{ required: true, message: 'Please input email!' }]">
                <a-input v-model:value="userForm.email" />
            </a-form-item>
    
            <a-form-item label="手机号" name="phone"
                :rules="[{ required: true, message: 'Please input phone!' }]">
                <a-input v-model:value="userForm.phone" />
            </a-form-item>
    
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
    </template>
    <script>
        import { reactive , watchEffect} from 'vue';
        export default {
            props:["user","onSubmit"],
            setup(props) {
                const user = props.user;
                const userForm = reactive({
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                });
                watchEffect(() => {
                    userForm.id = props.user.id;
                    userForm.email = props.user.email;
                    userForm.phone = props.user.phone;
                })
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