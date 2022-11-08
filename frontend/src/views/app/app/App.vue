<template>
    <div>
        <a-card title="应用管理">
            <template #extra>
                <a @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索应用" enter-button="查询"
                @search="handleQueryApp" />
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
    <a-drawer title="添加应用" :width="500" :visible="showAppAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <AppAdd :onSuccess="onAddAppSuccess" />
    </a-drawer>
    <a-drawer title="编辑应用" :width="500" :visible="showAppEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <AppEdit :app="app" :onSubmit="handleUpdateApp" />
    </a-drawer>
</template>
<script setup>
import { queryApp, updateApp, deleteApp } from '@/api/app';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import AppAdd from './components/AppAdd.vue';
import AppEdit from './components/AppEdit.vue';
import { formatTimestamp } from '@/utils/time'
const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '应用名',
        dataIndex: 'name',
        key: 'appname',
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
        title: '修改时间',
        dataIndex: 'updateAt',
        key: 'updateAt',
    },
    {
        title: '修改者',
        dataIndex: 'updateBy',
        key: 'updateBy',
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
const keyword = ref('');
const showAppAddDrawer = ref(false);
const showAppEditDrawer = ref(false);
const app = ref({});

onMounted(() => {
    handleQueryApp();
});
const handleQueryApp = () => {
    queryApp({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        name: keyword.value
    }).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const onAddAppSuccess = () => {
    message.success('添加成功');
    handleQueryApp();
    showAppAddDrawer.value = false;
}
const handleUpdateApp = (app) => {
    updateApp(app).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryApp();
            showAppEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryApp();
}
const onAddClick = () => {
    showAppAddDrawer.value = true;
};
const onEditClick = (record) => {
    showAppEditDrawer.value = true;
    app.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该应用吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteApp({ id }).then(() => {
                    if (!res.code) {
                        handleQueryApp();
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
        showAppAddDrawer.value = false;
    } else {
        showAppEditDrawer.value = false;
    }
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>