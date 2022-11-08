<template>
    <div>
        <div>
            <label>用例名</label>
            <a-input v-model:value="requestObj.name" placeholder="请输入用例名称" disabled />
        </div>
        <div>
            <label>路径</label>
            <a-input-group>
                <a-row>
                    <a-col :span="2">
                        <a-input v-model:value="requestObj.requestMethod" disabled />
                    </a-col>
                    <a-col :span="9">
                        <a-input v-model:value="requestObj.baseUrl" />
                    </a-col>
                    <a-col :span="10">
                        <a-input v-model:value="requestObj.url" disabled />
                    </a-col>
                    <a-col :span="2">
                        <a-button type="primary" @click="onSendClick">发送</a-button>
                    </a-col>
                </a-row>
            </a-input-group>
        </div>
        <div v-if="requestObj.requestHeaders && requestObj.requestHeaders.length > 0">
            <label>请求头</label>
            <a-row v-for="item in requestObj.requestHeaders">
                <a-col :span="12">
                    <a-input v-model:value="item.name" disabled />
                </a-col>
                <a-col :span="12">
                    <a-input v-model:value="item.value" :disabled="item.name.toLowerCase() == 'content-type'" />
                </a-col>
            </a-row>
        </div>
        <div v-if="requestObj.requestMethod == 'get'">
            <label>请求参数</label>
            <a-row v-for="item in requestObj.requestParams">
                <a-col :span="12">
                    <a-input v-model:value="item.name" disabled />
                </a-col>
                <a-col :span="12">
                    <a-input v-model:value="item.value" />
                </a-col>
            </a-row>
        </div>
        <div v-else>
            <label>请求体</label>
            <JsonEditorVue v-model="requestObj.requestBody" style="height: 300px;" />
        </div>
        <div>
            <label>响应</label>
            <div v-show="responseObj.statusCode">状态码：{{responseObj.statusCode}}</div>
            <JsonEditorVue class="editor" v-model="responseObj.response" style="height: 300px;" />
        </div>
    </div>
</template>
<script >
import { getById } from '@/api/api';
import { debugTestCase } from '@/api/testCase';
import { defineComponent, ref, reactive, onMounted, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue3';

export default defineComponent({
    props: ["testCase"],
    components: {
        JsonEditorVue
    },
    setup(props) {
        const requestObj = ref({
            statusCode: null,
            response: null
        });
        const responseObj = ref({});
        const init = (testCase) => {
            getById({
                id: testCase.apiId
            }).then(res => {
                if (!res.code) {
                    let api = res.data;

                    //请求头
                    let requestHeaders = [];
                    const headerObj = JSON.parse(testCase.headers);
                    for (const name in headerObj) {
                        requestHeaders.push({
                            name,
                            value: headerObj[name]
                        })
                    }
                    if(api.contentType) {
                        requestHeaders.push({
                            name: 'Content-Type',
                            value: api.contentType
                        })
                    }
                    //请求方式
                    let requestMethod = api.requestMethod;
                    let requestParams = [];
                    let requestBody = {};
                    if (api.requestMethod == 'get') {
                        //请求参数
                        const requestBodyObj = JSON.parse(testCase.requestBody);
                        for (const name in requestBody) {
                            requestParams.push({
                                name,
                                value: requestBodyObj[name]
                            })
                        }
                    } else {
                        //请求体
                        requestBody = JSON.parse(testCase.requestBody);
                    }
                    requestObj.value = {
                        name: testCase.name,
                        baseUrl: 'http://localhost:3000',
                        url: api.url,
                        requestMethod,
                        requestHeaders,
                        requestParams,
                        requestBody
                    }
                }
            });
        }
        onMounted(() => {
            init(props.testCase);
            watch(props, (newValue, oldValue) => {
                console.log("testCase changed", newValue, oldValue);
                init(newValue.testCase);
            }, { immediate: false, deep: true });
        })

        const arrayToObj = (arr) => {
            let obj = {};
            for (const item of arr) {
                obj[item.name] = item.value;
            }
            return obj;
        }

        const onSendClick = () => {
            responseObj.value = {}
            debugTestCase({
                ...requestObj.value,
                url: requestObj.value.baseUrl + requestObj.value.url,
                requestMethod: requestObj.value.requestMethod,
                requestHeaders: JSON.stringify(arrayToObj(requestObj.value.requestHeaders)),
                requestParams: JSON.stringify(arrayToObj(requestObj.value.requestParams)),
                requestBody: JSON.stringify(requestObj.value.requestBody)
            }).then(res => {
                if(!res.code) {
                    responseObj.value.statusCode = res.data.statusCode;
                    if(res.data.statusCode == '200') {
                        responseObj.value.response = JSON.parse(res.data.body);
                    }
                }
            })
        };
        return {
            requestObj,
            responseObj,
            onSendClick
        }
    }
})
</script>
<style lang='less' scoped>

</style>