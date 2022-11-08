<template>
<div>
    <a-form :model="roleForm" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="角色名称" name="name"
            :rules="[{ required: true, message: 'Please input name!' }]">
            <a-input v-model:value="roleForm.name" />
        </a-form-item>

        <a-form-item label="角色描述" name="description">
            <a-textarea v-model:value="roleForm.description" :rows="4" placeholder="限制50个字符" :maxlength="50" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
            <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
    </a-form>
</div>
</template>
<script>
    import { reactive } from 'vue';
    import { addRole } from '@/api/role';
    export default {
        props:["onSuccess"],
        setup(props) {
            const roleForm = reactive({
                name: '',
                description: '',
            });
            const onFinishFailed = errorInfo => {
                console.log('Failed:', errorInfo);
            };
            const onFinish = () => {
                addRole(roleForm).then(res => {
                    if (!res.code) {
                        props.onSuccess();
                        roleForm.name = '';
                        roleForm.description = '';
                    }
                });
            }
            return {
                roleForm,
                onFinishFailed,
                onFinish
            }
        }
    }
</script>
<style lang='less' scoped>

</style>