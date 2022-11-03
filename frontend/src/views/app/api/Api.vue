<template>
    <div>
        <a-card title="API管理">
            <template #extra>
                <a @click="onAddClick">添加</a>
                <a-divider type="vertical" />
                <a @click="onImportClick">导入</a>
            </template>
            <div class="search-wrapper">
                <label>选择应用：</label>
                <AppSelectVue v-model:appId="appId" style="width: 200px;" @update:appId="appId = $event" />
                <a-input-search v-model:value="keyword" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索API名称"
                    enter-button="查询" @search="handleQueryApi" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
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
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a style="color: red;" @click="onDelClick(record.id)">删除</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加API" :width="700" :visible="showApiAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <ApiAdd :onSubmit="handleAddApi" />
    </a-drawer>
    <a-drawer title="编辑API" :width="700" :visible="showApiEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <ApiEdit :api="api" :onSubmit="handleUpdateApi" />
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
</template>
<script setup>
import { addApi, queryApi, updateApi, deleteApi, importApi } from '@/api/api';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive,h } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import ApiAdd from './components/ApiAdd.vue';
import ApiEdit from './components/ApiEdit.vue';
import ApiImport from './components/ApiEdit.vue';
import { formatTimestamp } from '@/utils/time'
import AppSelectVue from '@/components/AppSelect.vue';
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
const keyword = ref(null);
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

onMounted(() => {
    handleQueryApi();
});
const handleQueryApi = () => {
    queryApi({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        name: keyword.value,
        appId: appId.value
    }).then(res => {
        if (!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const handleAddApi = (api) => {
    addApi(api).then(res => {
        if (!res.code) {
            message.success('添加成功');
            handleQueryApi();
            showApiAddDrawer.value = false;
        }
    });
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
    if (type === 'add') {
        showApiAddDrawer.value = false;
    } else {
        showApiEditDrawer.value = false;
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
        }
        importLoading.value = false;
    })
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>