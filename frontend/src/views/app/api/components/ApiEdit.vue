<template>
    <div>
        <a-form :model="apiForm" name="basic" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" autocomplete="off"
            @finish="onSubmit(apiForm)" @finishFailed="onFinishFailed">
            <a-form-item label="选择应用" name="appId" :rules="[{ required: true, message: 'Please choose app!' }]">
                <AppSelect v-model:appId=apiForm.appId style="width:100%;" :readonly="readonly"/>
            </a-form-item>

            <a-form-item label="分组" name="groupName" :rules="[{ required: true, message: 'Please input groupName!' }]">
                <a-input v-model:value="apiForm.groupName" />
            </a-form-item>

            <a-form-item label="模块" name="moduleName"
                :rules="[{ required: true, message: 'Please input moduleName!' }]">
                <a-input v-model:value="apiForm.moduleName" />
            </a-form-item>

            <a-form-item label="API名称" name="apiName" :rules="[{ required: true, message: 'Please input apiName!' }]">
                <a-input v-model:value="apiForm.apiName" />
            </a-form-item>

            <a-form-item label="URL" name="url" :rules="[{ required: true, message: 'Please input url!' }]">
                <a-input v-model:value="apiForm.url" />
            </a-form-item>
            <a-form-item label="Request Method" name="requestMethod"
                :rules="[{ required: true, message: 'Please choose requestMethod!' }]">
                <a-select v-model:value="apiForm.requestMethod">
                    <a-select-option value="get">get</a-select-option>
                    <a-select-option value="post">post</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Content-Type" name="contentType"
                :rules="[{ required: true, message: 'Please choose contentType!' }]">
                <a-select v-model:value="apiForm.contentType">
                    <a-select-option value="application/json">application/json</a-select-option>
                    <a-select-option value="multipart/form-data"> multipart/form-data</a-select-option>
                    <a-select-option value="multipart/form-data">multipart/form-data</a-select-option>
                    <a-select-option value="">无</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="查询参数" name="query">
                <a-textarea v-model:value="apiForm.query" :rows="4" placeholder="json格式" :maxlength="1000" />
            </a-form-item>

            <a-form-item label="请求体Schema" name="body">
                <a-textarea v-model:value="apiForm.body" :rows="4" placeholder="json schema" :maxlength="1000" />
            </a-form-item>

            <a-form-item label="请求头" name="headers">
                <a-textarea v-model:value="apiForm.headers" :rows="4" placeholder="json格式" :maxlength="1000" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 5, span: 19 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { reactive, ref, watchEffect } from 'vue';
import AppSelect from '@/components/AppSelect.vue';
export default {
    props: ["api", "onSubmit"],
    components: {
        AppSelect
    },
    setup(props) {
        const readonly = ref(true);
        const apiForm = reactive({
            ...props.api
        });
        watchEffect(() => {
            apiForm.id = props.api.id;
            apiForm.appId = props.api.appId;
            apiForm.groupName = props.api.groupName;
            apiForm.moduleName = props.api.moduleName;
            apiForm.apiName = props.api.apiName;
            apiForm.requestMethod = props.api.requestMethod;
            apiForm.contentType = props.api.contentType;
            apiForm.query = props.api.query;
            apiForm.body = props.api.body;
            apiForm.headers = props.api.headers;
        })
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        return {
            readonly,
            apiForm,
            onFinishFailed
        }
    }
}
</script>
<style lang='less' scoped>

</style>