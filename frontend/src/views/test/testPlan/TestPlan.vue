<template>
    <div>
        <a-card title="测试计划">
            <div class="search-wrapper">
                <label>选择应用：</label>
                <AppSelectVue v-model:appId="appId" style="width: 200px;" @update:appId="appId = $event" />
                <a-input-search v-model:value="keyword" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索用例名称"
                    enter-button="查询" @search="handleQueryTestPlan" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"  >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'run'">
                        <span>
                           {{record.run ? '已执行' : '未执行'}}
                        </span>
                    </template>
                    <template v-if="column.key === 'mailReport'">
                        <span>
                            {{record.mailReport ? '是' : '否'}}
                        </span>
                    </template>
                    <template v-if="column.key === 'startAt'">
                        <span v-if="record.run">
                            {{ formatTimestamp(record.startAt) }}
                        </span>

                    </template>
                    <template v-if="column.key === 'createAt'">
                        <span>
                            {{ formatTimestamp(record.createAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a style="color: red;" @click="onDelClick(record.id)">删除</a>
                            <a-divider type="vertical" />
                            <a @click="onViewReportClick(record.id)">查看测试报告</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>
<script setup>
import { queryTestPlan, deleteTestPlan } from '@/api/testPlan';
import { Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
// import TestPlanAdd from './components/TestPlanAdd.vue';
import { formatTimestamp } from '@/utils/time'
import AppSelectVue from '@/components/AppSelect.vue';
import router from '@/router';

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
        dataIndex: 'caseNum',
        key: 'caseNum',
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
        title: '耗时(ms)',
        dataIndex: 'cost',
        key: 'cost',
    },
    {
        title: '是否发送邮件测试报告',
        dataIndex: 'mailReport',
        key: 'mailReport',
    },
    {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
    },
    {
        title: '创建人',
        dataIndex: 'createBy',
        key: 'createBy',
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
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryTestPlan();
}

const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该API吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteTestPlan({ id }).then((res) => {
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
const onViewReportClick = (planId) => {
    router.push('/test/testReport/'+planId);
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>