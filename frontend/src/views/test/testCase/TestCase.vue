<template>
    <div>
        <a-card title="用例管理">
            <template #extra>
                <a @click="onAddClick">生成默认用例</a>
                <a-divider type="vertical" />
                <a @click="onAddClick">设置前置用例</a>

            </template>
            <div class="search-wrapper">
                <label>选择应用：</label><AppSelectVue v-model:appId="queryForm.appId" style="width: 200px;" @update:appId="appId = $event" />
                <label> API ID: </label><a-input-number v-model:value="queryForm.apiId" :min="1" placeholder="请输入API id"
                    style="width: 200px;" />
                <a-input-search v-model:value="queryForm.name" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索用例名称"
                    enter-button="查询" @search="handleQueryTestCase" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange" size="small">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'run'">
                        <span v-if="record.run">
                            <check-outlined />
                        </span>
                        <span v-else>
                            <close-outlined />
                        </span>
                    </template>
                    <template v-if="column.key === 'preCaseId'">
                        <span v-if="!record.preCaseId">
                            无
                        </span>
                    </template>
                    <template v-if="column.key === 'preFields'">
                        <span v-if="record.preCaseId">
                            <a @click="onViewJsonClick(record.preFields,'前置字段')"><eye-outlined /></a>
                        </span>
                        <span v-else>无</span>
                    </template>
                    <template v-if="column.key === 'headers'">
                        <span>
                            <a @click="onViewJsonClick(record.headers,'请求头')"><eye-outlined /></a>
                        </span>
                    </template>
                    <template v-if="column.key === 'requestBody'">
                        <span>
                            <a @click="onViewJsonClick(record.requestBody,'请求参数')"><eye-outlined /></a>
                        </span>
                    </template>
                    <template v-if="column.key === 'assert'">
                        <span>
                            <a @click="onViewJsonClick(record.assert,'断言')"><eye-outlined /></a>
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
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a style="color: red;" @click="onDelClick(record.id)">删除</a>
                            <a-divider type="vertical" />
                            <a  @click="onCopyClick(record)">克隆</a>
                            <a-divider type="vertical" />
                            <a style="color: green;" @click="onRunClick(record)">运行</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="编辑测试用例" :width="700" :visible="showTestCaseEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <TestCaseEdit :testCase="testCase" :onSubmit="handleUpdateTestCase" />
    </a-drawer>
    <a-modal v-model:visible="showViewJsonModal" :title="title" @ok="showViewJsonModal = !showViewJsonModal" ok-text="关闭">
        <JsonViewer :value="jsonObj" copyable boxed sort theme="jv-light"/>
    </a-modal>

</template>
<script setup>
import { addTestCase, queryTestCase, updateTestCase, deleteTestCase, createDefaultForAll,bactchSetPreCase } from '@/api/testCase';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive,h } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { formatTimestamp } from '@/utils/time'
import AppSelectVue from '@/components/AppSelect.vue';
import { EyeOutlined,CheckOutlined,CloseOutlined } from '@ant-design/icons-vue';
import TestCaseEdit from './components/TestCaseEdit.vue';

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
        title: 'API ID',
        dataIndex: 'apiId',
        key: 'apiId',
    },
    {
        title: '用例名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '开启执行',
        dataIndex: 'run',
        key: 'run',
    },
    {
        title: '前置用例',
        dataIndex: 'preCaseId',
        key: 'preCaseId',
    },
    {
        title: '前置字段',
        dataIndex: 'preFields',
        key: 'preFields',
    },
    {
        title: '请求头',
        dataIndex: 'headers',
        key: 'headers',
    },
    {
        title: '请求参数',
        dataIndex: 'requestBody',
        key: 'requestBody',
    },
    {
        title: '断言',
        dataIndex: 'assert',
        key: 'assert',
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
const queryForm = ref({
    appId: null,
    apiId: null,
    name: null,
})
const showTestCaseEditDrawer = ref(false);
const testCase = ref(null);
const title = ref('');
const jsonObj = ref({});
const showViewJsonModal = ref(false);
const onViewJsonClick = (json,text) => {
    jsonObj.value = JSON.parse(json);
    showViewJsonModal.value = true;
    title.value = text;
};
onMounted(() => {
    handleQueryTestCase();
});
const handleQueryTestCase = () => {
    queryTestCase({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        ...queryForm.value
    }).then(res => {
        if (!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const handleUpdateTestCase = (testCaseForm) => {
    updateTestCase(testCaseForm).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryTestCase();
            showTestCaseEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryTestCase();
}
const onAddClick = () => {
    // showTestCaseAddDrawer.value = true;
};
const onEditClick = (record) => {
    showTestCaseEditDrawer.value = true;
    testCase.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该API吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteTestCase({ id }).then(() => {
                    if (!res.code) {
                        handleQueryTestCase();
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
        showTestCaseAddDrawer.value = false;
    } else {
        showTestCaseEditDrawer.value = false;
    }
};
const onRunClick = (record) => {

}
const onCopyClick = (record) => {

}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>