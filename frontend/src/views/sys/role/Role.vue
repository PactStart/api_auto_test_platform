<template>
    <div>
        <a-card title="角色管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索角色名" enter-button="查询"
                @search="handleQueryRole" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'createAt'">
                        <span>
                            {{ formatTimestamp(record.createAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a v-show="showDelBtn" style="color: red;" @click="onDelClick(record.id)">删除</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加角色" :width="500" :visible="showRoleAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <RoleAdd :onSuccess="onAddRoleSuccess" />
    </a-drawer>
    <a-drawer title="编辑角色" :width="500" :visible="showRoleEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <RoleEdit :role="role" :onSubmit="handleUpdateRole" />
    </a-drawer>
</template>
<script setup>
import { queryRole, updateRole, deleteRole } from '@/api/role';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import RoleAdd from './components/RoleAdd.vue';
import RoleEdit from './components/RoleEdit.vue';
import { formatTimestamp } from '@/utils/time';
import { useStore } from 'vuex';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('add-role-btn') > -1  || store.state.buttonPermList.indexOf('all-role-btn') > -1 
});
const showDelBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('del-role-btn') > -1  || store.state.buttonPermList.indexOf('all-role-btn') > -1 
});
const showEditBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('edit-role-btn') > -1  || store.state.buttonPermList.indexOf('all-role-btn') > -1 
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '角色名',
        dataIndex: 'name',
        key: 'rolename',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
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
const showRoleAddDrawer = ref(false);
const showRoleEditDrawer = ref(false);
const role = ref({});

onMounted(() => {
    handleQueryRole();
});
const handleQueryRole = () => {
    queryRole({
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
const onAddRoleSuccess = (role) => {
    message.success('添加成功');
    handleQueryRole();
    showRoleAddDrawer.value = false;
}
const handleUpdateRole = (role) => {
    updateRole(role).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryRole();
            showRoleEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryRole();
}
const onAddClick = () => {
    showRoleAddDrawer.value = true;
};
const onEditClick = (record) => {
    showRoleEditDrawer.value = true;
    role.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该角色吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteRole({ id }).then(() => {
                    if (!res.code) {
                        handleQueryRole();
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
        showRoleAddDrawer.value = false;
    } else {
        showRoleEditDrawer.value = false;
    }
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>