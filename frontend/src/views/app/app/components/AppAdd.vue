<template>
<div>
    <a-form :model="appForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
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
    import { addApp } from '@/api/app';
    import { reactive } from 'vue';
    export default {
        props:["onSuccess"],
        setup(props) {
            const appForm = reactive({
                name: '',
            });
            const onFinishFailed = errorInfo => {
                console.log('Failed:', errorInfo);
            };
            const onFinish = (app) => {
                addApp(app).then(res => {
                    if (!res.code) {
                        props.onSuccess();
                        appForm.name = '';
                    }
                });
            }
            return {
                appForm,
                onFinishFailed,
                onFinish
            }
        }
    }
</script>
<style lang='less' scoped>

</style>