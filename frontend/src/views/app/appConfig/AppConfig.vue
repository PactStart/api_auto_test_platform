<template>
    <div>
        <a-card title="应用配置管理">
            <template #extra>
                <a @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <label>选择应用：</label><AppSelectVue  v-model:appId="queryForm.appId" style="width: 200px;" @update:appId="queryForm.appId = $event"/>
                <a-input-search v-model:value="queryForm.configKey" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索配置名"
                    enter-button="查询" @search="handleQueryAppConfig" />
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
    <a-drawer title="添加配置" :width="500" :visible="showAppConfigAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <AppConfigAdd :onSuccess="onAddConfigSuccess" />
    </a-drawer>
    <a-drawer title="编辑配置" :width="500" :visible="showAppConfigEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <AppConfigEdit :appConfig="appConfig" :onSubmit="handleUpdateAppConfig" />
    </a-drawer>
</template>
<script setup>
import { queryAppConfig, updateAppConfig, deleteAppConfig } from '@/api/appConfig';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import AppConfigAdd from './components/AppConfigAdd.vue';
import AppConfigEdit from './components/AppConfigEdit.vue';
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
        title: '配置描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '配置名',
        dataIndex: 'configKey',
        key: 'configValue',
    },
    {
        title: '配置值',
        dataIndex: 'configValue',
        key: 'configValue',
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
const queryForm = ref({
    appId: null,
    configKey: null,
})
const showAppConfigAddDrawer = ref(false);
const showAppConfigEditDrawer = ref(false);
const appConfig = ref({});

onMounted(() => {
    handleQueryAppConfig();
});
const handleQueryAppConfig = () => {
    queryAppConfig({
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
const onAddConfigSuccess = (appConfig) => {
    message.success('添加成功');
    handleQueryAppConfig();
    showAppConfigAddDrawer.value = false;
}
const handleUpdateAppConfig = (appConfig) => {
    updateAppConfig(appConfig).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryAppConfig();
            showAppConfigEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryAppConfig();
}
const onAddClick = () => {
    showAppConfigAddDrawer.value = true;
};
const onEditClick = (record) => {
    showAppConfigEditDrawer.value = true;
    appConfig.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该配置吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteAppConfig({ id }).then(() => {
                    if (!res.code) {
                        handleQueryAppConfig();
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
        showAppConfigAddDrawer.value = false;
    } else {
        showAppConfigEditDrawer.value = false;
    }
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>