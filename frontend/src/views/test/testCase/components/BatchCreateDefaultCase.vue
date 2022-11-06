<template>
    <div>
        <a-form :model="batchCreateDefaultCaseForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="finish" @onFinishFailed="onFinishFailed">
            <a-form-item label="应用" name="appId" :rules="[{ required: true, message: 'Please choose app!' }]">
                <AppSelect v-model:appId="batchCreateDefaultCaseForm.appId" style="width: 100%;" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script>
import { ref,reactive, defineComponent } from 'vue';
import AppSelect from '@/components/AppSelect.vue';

export default defineComponent({
    props: ["onSubmit"],
    components: {
        AppSelect,
    },
    setup(props) {
        const batchCreateDefaultCaseForm = reactive({
            appId: null,
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const finish = () => {
            props.onSubmit({
                ...batchCreateDefaultCaseForm,
            })
        };
        return {
            batchCreateDefaultCaseForm,
            onFinishFailed,
            finish
        }
    }
});
</script>
<style lang='less' scoped>

</style>