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
        <div v-if="requestObj.requestMethod == 'get'&& requestObj.requestParams && requestObj.requestParams.length > 0">
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
            <div v-show="statusCode != null">状态码：{{statusCode}}</div>
            <JsonEditorVue class="editor" v-model="response" style="height: 300px;" />
        </div>
    </div>
</template>
<script >
import { getById } from '@/api/api';
import { debugTestCase } from '@/api/testCase';
import { defineComponent, ref, onMounted, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue3';

export default defineComponent({
    props: ["testCase"],
    components: {
        JsonEditorVue
    },
    setup(props) {
        const statusCode = ref(null);
        const response = ref({});
        const requestObj = ref({});
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
                    if(api.contentType && !headerObj['content-type']) {
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
                        for (const name in requestBodyObj) {
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
                    // console.log(api,testCase,requestObj);
                }
            });
            statusCode.value = null;
            response.value = {};
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

        const arrayToString = (arr) => {
            let str = '';
            for (const item of arr) {
                str = str + item['name'] + '=' + item['value'] + '&';
            }
            return str;
        }

        const onSendClick = () => {
            statusCode.value = null;
            response.value = {};
            debugTestCase({
                ...requestObj.value,
                url: requestObj.value.baseUrl + requestObj.value.url,
                requestMethod: requestObj.value.requestMethod,
                requestHeaders: JSON.stringify(arrayToObj(requestObj.value.requestHeaders)),
                queryString: arrayToString(requestObj.value.requestParams),
                requestBody: JSON.stringify(requestObj.value.requestBody)
            }).then(res => {
                if(!res.code) {
                    statusCode.value = res.data.statusCode;
                    if(res.data.statusCode == '200') {
                        response.value = JSON.parse(res.data.body);
                    }
                }
            })
        };
        return {
            requestObj,
            statusCode,
            response,
            onSendClick
        }
    }
})
</script>
<style lang='less' scoped>

</style>