<template>
    <div>
        <a-form :model="permissionForm" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"
            autocomplete="off" @finish="onSubmit" @finishFailed="onFinishFailed">
            <a-form-item label="上级ID" name="parentId" :rules="[{ required: true, message: 'Please input parentId!' }]">
                <a-input-number v-model:value="permissionForm.parentId" :min="1" placeholder="请输入上级权限ID，无则为0"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item label="类型" name="type" :rules="[{ required: true, message: 'Please choose type!' }]">
                <a-radio-group v-model:value="permissionForm.type" disabled>
                    <a-radio value="API">API</a-radio>
                    <a-radio value="Page">页面</a-radio>
                    <a-radio value="Button">按钮</a-radio>
                    <a-radio value="Data">数据</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="名字" name="name" :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="permissionForm.name" placeholder="唯一，不可重复" disabled />
            </a-form-item>

            <a-form-item label="描述" name="description">
                <a-textarea v-model:value="permissionForm.description" :rows="4" placeholder="限制50个字符"
                    :maxlength="50" />
            </a-form-item>

            <a-form-item label="是否内部" name="internal" :rules="[{ required: true, message: 'Please choose internal!' }]">
                <a-radio-group v-model:value="permissionForm.internal">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="是否登录即可访问" name="login" :rules="[{ required: true, message: 'Please choose login!' }]">
                <a-radio-group v-model:value="permissionForm.login">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="是否匿名即可访问" name="anon" :rules="[{ required: true, message: 'Please input nickname!' }]">
                <a-radio-group v-model:value="permissionForm.anon">
                    <a-radio value="1">是</a-radio>
                    <a-radio value="0">否</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { reactive, watchEffect } from 'vue';
export default {
    props: ["permission", "onSubmit"],
    setup(props) {
        const permission = props.permission;
        const permissionForm = reactive({
            id: permission.id,
            parentId: permission.parentId,
            type: permission.type,
            name: permission.name,
            description: permission.description,
            internal: permission.internal+'',
            anon: permission.anon+'',
            login: permission.login+'',
        });
        watchEffect(() => {
            permissionForm.id = permission.id;
            permissionForm.parentId = permission.parentId;
            permissionForm.type = permission.type;
            permissionForm.name = permission.name;
            permissionForm.description = permission.description;
            permissionForm.internal = permission.internal+'';
            permissionForm.anon = permission.anon+'';
            permissionForm.login = permission.login+'';
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        return {
            permissionForm,
            onFinishFailed
        }
    }
}
</script>
<style lang='less' scoped>

</style>