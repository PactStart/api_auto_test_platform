<template>
    <div>
        <a-card title="API管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
                <a-divider type="vertical" />
                <a v-show="showImportBtn" @click="onImportClick">导入</a>
            </template>
            <div class="search-wrapper">
                <label>选择应用：</label>
                <AppSelectVue v-model:appId="appId" style="width: 200px;" @update:appId="appId = $event" />
                <label> 分组：</label>
                <a-auto-complete v-model:value="queryForm.groupName" :options="groupNameList" style="width: 150px"
                    placeholder="请输入API分组" :filter-option="filterOption" />
                <label> 模块：</label>
                <a-auto-complete v-model:value="queryForm.moduleName" :options="moduleNameList" style="width: 150px"
                    placeholder="请输入API模块" :filter-option="filterOption" />
                <a-input-search v-model:value="queryForm.apiName" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索API名称"
                    enter-button="查询" @search="handleQueryApi" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" size="small">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'query'">
                        <span>
                            <a @click="onViewJsonClick(record.query)">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'body'">
                        <span>
                            <a @click="onViewJsonClick(record.body)">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'headers'">
                        <span>
                            {{ getFieldNames(record.headers) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createAt'">
                        <span>
                            {{ formatTimestamp(record.createAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'updateAt'">
                        <span>
                            {{ formatTimestamp(record.updateAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'caseNum'">
                        <span>
                            <a @click="onViewCaseClick(record)">
                                <span class="case_num">{{record.caseNum}}</span>
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a v-show="showDelBtn" style="color: red;" @click="onDelClick(record.id)">删除</a>
                            <a-divider type="vertical" />
                            <a v-show="showAddCaseBtn" @click="onAddCaseClick(record)">添加用例</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加API" :width="700" :visible="showApiAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('api_add')">
        <ApiAdd :onSuccess="onAddApiSuccess" />
    </a-drawer>
    <a-drawer title="编辑API" :width="700" :visible="showApiEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('api_edit')">
        <ApiEdit :api="api" :onSubmit="handleUpdateApi" />
    </a-drawer>
    <a-drawer title="添加测试用例" :width="700" :visible="showTestCaseAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('test_case_add')">
        <TestCaseAdd :apiId="apiId" :onSuccess="onAddTestCaseSuccess"/>
    </a-drawer>

    <a-modal v-model:visible="showApiImportModal" title="导入API" @ok="handleImport" ok-text="提交"
        :confirmLoading="importLoading" cancel-text="取消">
        <a-form :model="importForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
            <a-form-item label="分组" name="groupName">
                <a-input v-model:value="importForm.groupName" placeholder="请输入分组名称，不填为自动识别" />
            </a-form-item>
            <a-form-item label="应用" name="appId" :rules="[{ required: true, message: 'Please choose app!' }]">
                <AppSelectVue v-model:appId="importForm.appId" style="width: 100%;"
                    @update:appId="importForm.appId = $event" />
            </a-form-item>
            <a-form-item label="URL" name="url" :rules="[{ required: true, message: 'Please input url!' }]">
                <a-input v-model:value="importForm.url" placeholder="请输入swagger api文档地址" />
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal v-model:visible="showViewJsonModal" title="请求体" @ok="showViewJsonModal = !showViewJsonModal" ok-text="关闭">
        <JsonViewer :value="apiBody" copyable boxed sort theme="jv-light" />
    </a-modal>

</template>
<script setup>
import { queryApi, updateApi, deleteApi, importApi, queryGroupAndModule } from '@/api/api';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, h, watch, computed } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ApiAdd from './components/ApiAdd.vue';
import ApiEdit from './components/ApiEdit.vue';
import { formatTimestamp } from '@/utils/time'
import AppSelectVue from '@/components/AppSelect.vue';
import { EyeOutlined } from '@ant-design/icons-vue';
import TestCaseAdd from '@/views/test/testCase/components/TestCaseAdd.vue';
import router from '@/router';
import { useStore } from 'vuex';

const store = useStore();

const showAddBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('add-api-btn') > -1  || store.state.buttonPermList.indexOf('all-api-btn') > -1 
});
const showDelBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('del-api-btn') > -1  || store.state.buttonPermList.indexOf('all-api-btn') > -1 
});
const showEditBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('edit-api-btn') > -1  || store.state.buttonPermList.indexOf('all-api-btn') > -1 
});
const showImportBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('import-api-btn') > -1  || store.state.buttonPermList.indexOf('all-api-btn') > -1 
});
const showAddCaseBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('add-testCase-btn') > -1  || store.state.buttonPermList.indexOf('all-testCase-btn') > -1 
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '应用ID',
        dataIndex: 'appId',
        key: 'appId',
    },
    {
        title: '分组',
        dataIndex: 'groupName',
        key: 'groupName',
    },
    {
        title: '模块',
        dataIndex: 'moduleName',
        key: 'moduleName',
    },
    {
        title: 'API名称',
        dataIndex: 'apiName',
        key: 'apiName',
    },
    {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
    },
    {
        title: 'Method',
        dataIndex: 'requestMethod',
        key: 'requestMethod',
    },
    {
        title: 'Content-Type',
        dataIndex: 'contentType',
        key: 'contentType',
    },
    {
        title: '查询参数',
        dataIndex: 'query',
        key: 'query',
    },
    {
        title: '请求体',
        dataIndex: 'body',
        key: 'body',
    },
    {
        title: '请求头',
        dataIndex: 'headers',
        key: 'headers',
    },
    {
        title: '用例数',
        dataIndex: 'caseNum',
        key: 'caseNum',
    },
    {
        title: '操作',
        key: 'action',
    }
]);
const pagination = ref({
    position: ['bottomRight'],
    showSizeChanger: true,
    showTotal: (total, range) => {
        return '总共' + total + '条'
    },
    current: 1,
    pageSize: 10,
    total: 0
});
const appId = ref(null);
const groupNameList = ref([]);
const moduleNameList = ref([]);
const queryForm = ref({
    groupName: null,
    moduleName: null,
    apiName: null,
});
const showApiAddDrawer = ref(false);
const showApiEditDrawer = ref(false);
const showApiImportModal = ref(false);
const importLoading = ref(false);
const importForm = reactive({
    groupName: '默认分组',
    appId: null,
    url: null
});
const api = ref({});
watch(appId, (newValue, oldValue) => {
    // console.log('appId changed', newValue, oldValue);
    if (newValue == null) {
        groupNameList.value = [];
        moduleNameList.value = [];
    }
    if (oldValue == undefined && newValue == null) {
        return;
    }
    if (appId.value === null || appId.value === undefined) {
        return;
    }
    queryGroupAndModule({
        appId: appId.value
    }).then(res => {
        if (!res.code) {
            groupNameList.value = res.data.groupNameList.map(item => ({ value: item }));
            moduleNameList.value = res.data.moduleNameList.map(item => ({ value: item }));
        }
    })
}, { immediate: true, deep: true });
const filterOption = (input, option) => {
    return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
};
const getFieldNames = (jsonStr) => {
    const jsonObjArr = JSON.parse(jsonStr);
    let fieldNames = [];
    if (jsonObjArr instanceof Array) {
        for (const jsonObj of jsonObjArr) {
            fieldNames.push(jsonObj['name']);
        }
    }
    return fieldNames.length ? fieldNames.join(' | ') : '';
}
const apiBody = ref({});
const showViewJsonModal = ref(false);
const onViewJsonClick = (json) => {
    apiBody.value = JSON.parse(json);
    showViewJsonModal.value = true;
};
onMounted(() => {
    handleQueryApi();
});

const handleQueryApi = () => {
    queryApi({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        appId: appId.value,
        ...queryForm.value
    }).then(res => {
        if (!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const onAddApiSuccess = (api) => {
    message.success('添加成功');
    handleQueryApi();
    showApiAddDrawer.value = false;
}
const handleUpdateApi = (api) => {
    updateApi(api).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryApi();
            showApiEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryApi();
}
const onAddClick = () => {
    showApiAddDrawer.value = true;
};
const onEditClick = (record) => {
    showApiEditDrawer.value = true;
    api.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该API吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteApi({ id }).then(() => {
                    if (!res.code) {
                        handleQueryApi();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};
const onClose = (type) => {
    if (type === 'api_add') {
        showApiAddDrawer.value = false;
    } else if (type === 'api_edit') {
        showApiEditDrawer.value = false;
    } else if (type === 'test_case_add') {
        showTestCaseAddDrawer.value = false;
    }
}
const onImportClick = () => {
    showApiImportModal.value = true;
}

const handleImport = () => {
    importLoading.value = true;
    importApi(importForm).then(res => {
        if (!res.code) {
            showApiImportModal.value = false;
            importForm.url = null;
            importForm.appId = null;
            Modal.success({
                title: '导入成功',
                width: 400,
                content: h('div', {}, [h('p', `分组：${res.data.groupNum}个`), h('p', `模块：${res.data.groupNum}个`), h('p', `API：${res.data.apiNum}个`)]),
            });
            handleQueryApi();
        }
        importLoading.value = false;
    })
};

const showTestCaseAddDrawer = ref(false);
const apiId = ref(null);
const onAddCaseClick = (api) => {
    apiId.value = api.id;
    showTestCaseAddDrawer.value = true;
}

const onAddTestCaseSuccess = () => {
    message.success('添加成功');
    showTestCaseAddDrawer.value = false;
    handleQueryApi();
}

const onViewCaseClick = (record) => {
    router.push({
      path: '/test/testCase', query:{appId: record.appId, apiId: record.id}
    })
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}

.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}

.case_num {
    padding: 16px;
}
</style>