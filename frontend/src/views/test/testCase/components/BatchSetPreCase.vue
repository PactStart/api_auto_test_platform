<template>
    <div>
        <a-form :model="batchSetPreCaseForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off"
            @finish="finish" @onFinishFailed="onFinishFailed">
            <a-form-item label="应用" name="appId" :rules="[{ required: true, message: 'Please choose app!' }]">
                <AppSelect v-model:appId="batchSetPreCaseForm.appId" style="width: 100%;" />
            </a-form-item>
            <a-form-item label="前置用例" name="preCaseId" :rules="[{ required: true, message: 'Please input preCaseId!' }]">
                <a-input-number v-model:value="batchSetPreCaseForm.preCaseId" :min="1" placeholder="请输入前置用例 id"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item label="前置字段" name="preFields">
                <JsonEditorVue class="editor" v-model="batchSetPreCaseForm.preFields" style="height:500px;"/>
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
import JsonEditorVue from 'json-editor-vue3';

export default defineComponent({
    props: ["onSubmit"],
    components: {
        AppSelect,
        JsonEditorVue
    },
    setup(props) {
        const batchSetPreCaseForm = reactive({
            appId: null,
            preCaseId: null,
            preFields: [
                {
                    "field":"token",
                    "scope":"header|query|body",
                    "replace":"Authorization"
                },
            ]
        });
        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const finish = () => {
            props.onSubmit({
                ...batchSetPreCaseForm,
                preFields: JSON.stringify(batchSetPreCaseForm.preFields)
            })

        };
        return {
            batchSetPreCaseForm,
            onFinishFailed,
            finish
        }
    }
});
</script>
<style lang='less' scoped>

</style>