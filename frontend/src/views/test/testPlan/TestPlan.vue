<template>
    <div>
        <a-card title="测试计划">
            <template #extra>
                <a @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <label>选择应用：</label>
                <AppSelectVue v-model:appId="appId" style="width: 200px;" @update:appId="appId = $event" />
                <a-input-search v-model:value="keyword" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索用例名称"
                    enter-button="查询" @search="handleQueryTestPlan" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange" size="small" >
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
    <!-- <a-drawer title="添加测试计划" :width="700" :visible="showTestPlanAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <TestPlanAdd :onSubmit="handleAddTestPlan" />
    </a-drawer>
    -->
</template>
<script setup>
import { addTestPlan, queryTestPlan, deleteTestPlan } from '@/api/testPlan';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
// import TestPlanAdd from './components/TestPlanAdd.vue';
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
        title: '计划名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '是否已执行',
        dataIndex: 'run',
        key: 'run',
    },
    {
        title: '用例数',
        dataIndex: 'caseNUm',
        key: 'caseNUm',
    },
    {
        title: '通过数',
        dataIndex: 'passNum',
        key: 'passNum',
    },
    {
        title: '开始于',
        dataIndex: 'startAt',
        key: 'startAt',
    },
    {
        title: '耗时',
        dataIndex: 'cost',
        key: 'cost',
    },
    {
        title: '邮件报告',
        dataIndex: 'mailReport',
        key: 'mailReport',
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
const showTestPlanAddDrawer = ref(false);
const api = ref({});

onMounted(() => {
    handleQueryTestPlan();
});
const handleQueryTestPlan = () => {
    queryTestPlan({
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
const handleAddTestPlan = (api) => {
    addTestPlan(api).then(res => {
        if (!res.code) {
            message.success('添加成功');
            handleQueryTestPlan();
            showTestPlanAddDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryTestPlan();
}
const onAddClick = () => {
    showTestPlanAddDrawer.value = true;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该API吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteTestPlan({ id }).then(() => {
                    if (!res.code) {
                        handleQueryTestPlan();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};

</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>