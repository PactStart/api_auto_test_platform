<template>
    <div>
        <a-form :model="appConfigForm"  :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"
            autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">

            <a-form-item label="选择应用" name="appId" :rules="[{ required: true, message: 'Please choose app!' }]">
                <AppSelect v-model:appId="appConfigForm.appId" style="width:100%"
                    @update:appId="appConfigForm.appId = $event" />
            </a-form-item>

            <a-form-item label="配置名称" name="configKey"
                :rules="[{ required: true, message: 'Please input configKey!' }]">
                <a-input v-model:value="appConfigForm.configKey" />
            </a-form-item>

            <a-form-item label="配置值" name="configValue"
                :rules="[{ required: true, message: 'Please input configValue!' }]">
                <a-textarea v-model:value="appConfigForm.configValue" :rows="4" />
            </a-form-item>

            <a-form-item label="配置描述" name="description" :rules="[{ required: true, message: 'Please input description!' }]">
                <a-textarea v-model:value="appConfigForm.description" :rows="4" placeholder="限制50个字符" :maxlength="50" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { addAppConfig } from '@/api/appConfig';
import { reactive } from 'vue';
import AppSelect from '@/components/AppSelect.vue';
export default {
    props: ["onSuccess"],
    components: {
        AppSelect
    },
    setup(props) {
        const appConfigForm = reactive({
            appId: null,
            configKey: '',
            configValue: '',
            description: '',
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const onFinish = () => {
            addAppConfig(appConfigForm).then(res => {
                if (!res.code) {
                    props.onSuccess();
                    appConfigForm.configKey = '';
                    appConfigForm.configValue = '';
                    appConfigForm.description = '';
                }
            });
            
        };
        return {
            appConfigForm,
            onFinishFailed,
            onFinish
        }
    }
}
</script>
<style lang='less' scoped>

</style>