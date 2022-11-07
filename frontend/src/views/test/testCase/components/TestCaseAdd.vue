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
import { defineComponent, ref, onMounted, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue3';
import { getById } from '@/api/api';
import defaults from 'json-schema-defaults';

export default defineComponent({
    props: ["apiId", "onSubmit"],
    components: {
        JsonEditorVue
    },
    setup(props) {
        const defaultAssert = [
            {
                fieldPath: '$.code',
                predicate: '=',
                expectValue: 0,
                msg: 'code不为0'
            }
        ];
        const defaultPreFields = [
            {
                field: "token",
                scope: 'header'
            }
        ];
        const testCaseForm = ref({
            appId: null,
            apiId: null,
            name: '',
            preCaseId: 0,
            preFields: defaultPreFields,
            headers: {},
            requestBody: {},
            assert: defaultAssert,
        });
        const initTestCaseForm = (val) => {
            getById({ id: val }).then(res => {
                if (!res.code) {
                    let api = res.data;
                    testCaseForm.value.apiId = api.id;
                    testCaseForm.value.appId = api.appId;
                    testCaseForm.value.headers = getHeaderExample(api);
                    testCaseForm.value.requestBody = getBodyExample(api);
                }
            })
        }
        onMounted(() => {
            initTestCaseForm(props.apiId);
        });

        watch(props, (newValue, oldValue) => {
            console.log("apiId changed", newValue, oldValue);
            initTestCaseForm(props.apiId);
        }, { immediate: true, deep: true });

        const genJsonFromSchema = schema => {
            if (schema.type === 'object') {
                if (!schema.properties) {
                    return {};
                }
                let obj = {};
                for (var key in schema.properties) {
                    if (schema.properties.hasOwnProperty(key)) {
                        let type = schema.properties[key].type;
                        if (type == 'string') {
                            obj[key] = '';
                        } else if (type === 'integer') {
                            obj[key] = 0;
                        } else if (type === 'array') {
                            obj[key] = [];
                        } else if (type === 'boolean') {
                            obj[key] = true;
                        }

                    }
                }
                return obj;
            } else if (schema.type === 'array') {
                if (!schema.items) {
                    return [];
                }
            }
            return undefined;
        }

        const getBodyExample = (api) => {
            let bodyExample = {};
            if (
                api.requestMethod == "post" &&
                api.contentType == "application/json" &&
                api.body
            ) {
                const schema = JSON.parse(api.body);
                let bodyExample1 = defaults(schema);
                let bodyExample2 = genJsonFromSchema(schema);
                bodyExample = { ...bodyExample2, ...bodyExample1 }
            } else if (api.request_method == "get") {
                queryParamArr = JSON.parse(api.query);
                if (queryParamArr.length) {
                    for (const item of queryParamArr) {
                        if (item.type == "string") {
                            bodyExample[item.name] = "";
                        } else if (item.type == "integer") {
                            if (item.name == "page") {
                                bodyExample[item.name] = 1;
                            } else if (item.name == "size") {
                                bodyExample[item.name] = 10;
                            } else {
                                bodyExample[item.name] = 0;
                            }
                        }
                    }
                }
            }
            return bodyExample;
        };

        const getHeaderExample = (api) => {
            let headerExample = {};
            if (api.headers) {
                let headerArr = JSON.parse(api.headers);
                if (headerArr.length) {
                    for (let item of headerArr) {
                        headerExample[item.name] = "$" + item.name;
                    }
                }
            }
            if (api.content_type) {
                headerExample["content-type"] = api.content_type;
            }
            return headerExample
        };

        const onFinishFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };
        const onFinish = () => {
            props.onSubmit({
                appId: testCaseForm.value.appId,
                apiId: testCaseForm.value.apiId,
                name: testCaseForm.value.name,
                preCaseId: testCaseForm.value.preCaseId,
                preFields: JSON.stringify(testCaseForm.value.preFields),
                headers: JSON.stringify(testCaseForm.value.headers),
                requestBody: JSON.stringify(testCaseForm.value.requestBody),
                assert: JSON.stringify(testCaseForm.value.assert),
                run: true
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