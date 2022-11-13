<template>
    <div>
        <a-card title="用户管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索昵称、用户名、手机号、邮箱" enter-button="查询"
                @search="handleQueryUser" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'lastLoginTime'">
                        <span>
                            {{ formatTimestamp(record.lastLoginTime) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'createAt'">
                        <span>
                            {{ formatTimestamp(record.createAt) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                            <span v-if="!column.superAdmin">
                                <a-divider type="vertical" />
                                <a v-show="showDelBtn" style="color: red;" @click="onDelClick(record.id)">删除</a>
                                <a-divider type="vertical" />
                                <a v-show="showRestPwdBtn" @click="onResetPwdClick(record.id)">重置密码</a>
                            </span>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加用户" :width="500" :visible="showUserAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <UserAdd :onSuccess="onAddUserSuccess" />
    </a-drawer>
    <a-drawer title="编辑用户" :width="500" :visible="showUserEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <UserEdit :user="user" :onSubmit="handleUpdateUser" />
    </a-drawer>
    <a-modal v-model:visible="showResetPwdModal" title="重置密码" @ok="onResetPwdConfirmClick" ok-text="提交"
        cancel-text="取消">
        <a-form :model="resetPwdForm" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"
            autocomplete="off">
            <a-form-item label="新密码" name="password" :rules="[{ required: true, message: 'Please input password!' }]">
                <a-input-password v-model:value="resetPwdForm.password" />
            </a-form-item>

            <a-form-item label="确认新密码" name="confirmPassword"
                :rules="[{ required: true, message: 'Please input confirmPassword!' }]">
                <a-input-password v-model:value="resetPwdForm.confirmPassword" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup>
import { addUser, queryUser, updateUser, deleteUser, resetPwd } from '@/api/user';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import UserAdd from './components/UserAdd.vue';
import UserEdit from './components/UserEdit.vue';
import { formatTimestamp } from '@/utils/time';
import { useStore } from 'vuex';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('add-user-btn') > -1  || store.state.buttonPermList.indexOf('all-user-btn') > -1 
});
const showDelBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('del-user-btn') > -1  || store.state.buttonPermList.indexOf('all-user-btn') > -1 
});
const showEditBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('edit-user-btn') > -1  || store.state.buttonPermList.indexOf('all-user-btn') > -1 
});

const showRestPwdBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('restPwd-user-btn') > -1  || store.state.buttonPermList.indexOf('all-user-btn') > -1 
});

const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '上次登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
    },
    {
        title: '上次登录ip',
        dataIndex: 'lastLoginIp',
        key: 'lastLoginIp',
    },
    {
        title: '创建时间',
        dataIndex: 'createAt',
        key: 'createAt',
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
const keyword = ref(null);
const showUserAddDrawer = ref(false);
const showUserEditDrawer = ref(false);
const user = ref({});
const showResetPwdModal = ref(false);
const resetPwdForm = ref({
    id: '',
    password: '',
    confirmPassword: ''
});

onMounted(() => {
    handleQueryUser();
});
const handleQueryUser = () => {
    queryUser({
        page: pagination.value.current,
        size: pagination.value.pageSize,
        keyword: keyword.value
    }).then(res => {
        if(!res.code) {
            dataSource.value = res.data.list;
            pagination.value.total = res.data.total;
        }
    });
}
const onAddUserSuccess = (user) => {
    message.success('添加成功');
    handleQueryUser();
    showUserAddDrawer.value = false;
}
const handleUpdateUser = (user) => {
    updateUser(user).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryUser();
            showUserEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryUser();
}
const onAddClick = () => {
    showUserAddDrawer.value = true;
};
const onEditClick = (record) => {
    showUserEditDrawer.value = true;
    user.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该用户吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteUser({ id }).then(() => {
                    if (!res.code) {
                        handleQueryUser();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};
const onResetPwdClick = (id) => {
    showResetPwdModal.value = true;
    resetPwdForm.value.id = id;
};
const onResetPwdConfirmClick = () => {
    if (resetPwdForm.value.password != resetPwdForm.value.confirmPassword) {
        message.error('两次密码输入不一致');
    } else {
        resetPwd(resetPwdForm.value).then(res => {
            if (!res.code) {
                message.success('修改成功');
                showResetPwdModal.value = false;
            }
        });
    }
}

const onClose = (type) => {
    if (type === 'add') {
        showUserAddDrawer.value = false;
    } else {
        showUserEditDrawer.value = false;
    }
}
</script>
<style lang='less' scoped>
    .search-wrapper {
        margin-bottom: 20px;
    }
</style>