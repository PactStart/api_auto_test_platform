<template>
    <div>
        <a-form :model="appForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="onSubmit(appForm)" @finishFailed="onFinishFailed">
            <a-form-item label="应用名称" name="name"
                :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="appForm.name" />
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
            props:["app","onSubmit"],
            setup(props) {
                const app = props.app;
                const appForm = reactive({
                    id: app.id,
                    name: app.name,
                });
                watchEffect(() => {
                    appForm.id = props.app.id;
                    appForm.name = props.app.name;
                })
                const onFinishFailed = errorInfo => {
                    console.log('Failed:', errorInfo);
                };
                return {
                    appForm,
                    onFinishFailed
                }
            }
        }
    </script>
    <style lang='less' scoped>
    
    </style>