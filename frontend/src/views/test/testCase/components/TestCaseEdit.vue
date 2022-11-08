<template>
    <div>
        <a-form :model="testCaseForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @finish="onFinish"
            @finishFailed="onFinishFailed">
            <a-form-item label="API ID" name="name">
                <a-input-number v-model:value="testCaseForm.apiId" :min="1" placeholder="请输入API id" disabled
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item label="用例名" name="name">
                <a-input v-model:value="testCaseForm.name" placeholder="请输入用例名称" />
            </a-form-item>
            <a-form-item label="前置用例" name="preCaseId">
                <a-input-number v-model:value="testCaseForm.preCaseId" :min="0" placeholder="请输入前置用例ID,如无则填写0"
                    style="width: 100%;" />
            </a-form-item>
            <a-form-item label="前置字段" name="preFields">
                <JsonEditorVue class="editor" v-model="testCaseForm.preFields" />
            </a-form-item>
            <a-form-item label="请求参数" name="requestBody">
                <JsonEditorVue class="editor" v-model="testCaseForm.requestBody" />
            </a-form-item>
            <a-form-item label="请求头" name="headers">
                <JsonEditorVue class="editor" v-model="testCaseForm.headers" />
            </a-form-item>
            <a-form-item label="断言" name="assert">
                <JsonEditorVue class="editor" v-model="testCaseForm.assert" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>
<script >
import { defineComponent, ref, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue3';

export default defineComponent({
    props: ["testCase", "onSubmit"],
    components: {
        JsonEditorVue
    },
    setup(props) {
        const testCaseForm = ref({
        });
        const init = testCase => {
            testCaseForm.value = {
                ...testCase,
                preFields: JSON.parse(testCase.preFields),
                headers: JSON.parse(testCase.headers),
                requestBody: JSON.parse(testCase.requestBody),
                assert: JSON.parse(testCase.assert),
            }
        }
        watch(props, (newValue, oldValue) => {
            console.log("testCase changed", newValue, oldValue);
            init(newValue.testCase);
        }, { immediate: true, deep: true });

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const onFinish = () => {
            props.onSubmit({
                ...testCaseForm.value,
                preFields: JSON.stringify(testCaseForm.value.preFields),
                headers: JSON.stringify(testCaseForm.value.headers),
                requestBody: JSON.stringify(testCaseForm.value.requestBody),
                assert: JSON.stringify(testCaseForm.value.assert),
                run: !!testCaseForm.value.run
            })
        };
        return {
            testCaseForm,
            onFinish,
            onFinishFailed
        }
    }
})
</script>
<style lang='less' scoped>

</style>