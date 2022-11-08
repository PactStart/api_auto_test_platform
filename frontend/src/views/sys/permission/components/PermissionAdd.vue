<template>
    <div>
        <a-form :model="permissionForm" name="basic" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-form-item label="类型" name="type" :rules="[{ required: true, message: 'Please choose type!' }]">
                <a-radio-group v-model:value="permissionForm.type">
                    <a-radio value="API">API</a-radio>
                    <a-radio value="PAGE">页面</a-radio>
                    <a-radio value="BUTTON">按钮</a-radio>
                    <a-radio value="DATA">数据</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="名字" name="name" :rules="[{ required: true, message: 'Please input name!' }]">
                <a-input v-model:value="permissionForm.name" placeholder="唯一，不可重复" />
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
import { addPermission } from '@/api/permission';
import { ref } from 'vue';
export default {
    props: ["onSuccess"],
    setup(props) {
        const permissionForm = ref({
            type: null,
            name: '',
            description: '',
            internal: null,
            anon: null,
            login: null
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const onFinish = () => {
            addPermission({
                ...permissionForm.value
            }).then(res => {
                if (!res.code) {
                    props.onSuccess();
                    permissionForm.value = {
                        type: null,
                        name: '',
                        description: '',
                        internal: null,
                        anon: null,
                        login: null
                    };
                }
            });
        };
        return {
            permissionForm,
            onFinishFailed,
            onFinish
        }
    }
}
</script>
<style lang='less' scoped>

</style>