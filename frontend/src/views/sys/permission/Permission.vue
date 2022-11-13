<template>
    <div>
        <a-card title="权限管理">
            <template #extra>
                <a v-show="showAddBtn" @click="onAddClick">添加</a>
                <a-divider type="vertical" />
                <a v-show="showImportBtn" @click="onImportClick">导入</a>
            </template>
            <div class="search-wrapper">
                <a-form>
                    <a-row :gutter="24">
                        <a-col :span="4">
                            <a-form-item label="类型" name="type">
                                <a-select v-model:value="queryForm.type" style="width: 150px" allowClear>
                                    <a-select-option value="API">API接口</a-select-option>
                                    <a-select-option value="Page">页面</a-select-option>
                                    <a-select-option value="Button">按钮</a-select-option>
                                    <a-select-option value="Data">数据</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="是否内部" name="internal">
                                <a-select v-model:value="queryForm.internal" style="width: 150px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="匿名访问" name="anon">
                                <a-select v-model:value="queryForm.anon" style="width: 150px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="登录访问" name="login">
                                <a-select v-model:value="queryForm.login" style="width: 150px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="权限名" name="name">
                                <a-input-search v-model:value="queryForm.name" style="width: 350px" placeholder="模糊搜索权限名"
                                    enter-button="查询" @search="handleQueryPermission" />
                            </a-form-item>
                        </a-col>
                    </a-row>

                </a-form>

            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'type'">
                        <span style="background-color: lightgreen; padding: 5px">
                            {{ record.type }}
                        </span>
                    </template>
                    <template v-if="column.key === 'anon'">
                        <span v-show="record.anon" style="color: darkgreen; ">
                            是
                        </span>
                        <span v-show="!record.anon" style="color: red;">
                            否
                        </span>
                    </template>
                    <template v-if="column.key === 'internal'">
                        <span v-show="record.internal" style="color: darkgreen; ">
                            是
                        </span>
                        <span v-show="!record.internal" style="color: red;">
                            否
                        </span>
                    </template>
                    <template v-if="column.key === 'login'">
                        <span v-show="record.login" style="color: darkgreen; ">
                            是
                        </span>
                        <span v-show="!record.login" style="color: red;">
                            否
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
                            <a v-show="showEditBtn" @click="onEditClick(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a v-show="showDelBtn" style="color: red;" @click="onDelClick(record.id)">删除</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
    <a-drawer title="添加权限" :width="560" :visible="showPermissionAddDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('add')">
        <PermissionAdd :onSuccess="onAddSuccess" />
    </a-drawer>
    <a-drawer title="编辑权限" :width="500" :visible="showPermissionEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onClose('edit')">
        <PermissionEdit :permission="permission" :onSubmit="handleUpdatePermission" />
    </a-drawer>
    <a-modal v-model:visible="showImportModal" title="导入权限" @ok="handleImport" okText="导入" cancelText="取消">
        <a-tabs>
            <a-tab-pane key="1" tab="导入API权限" force-render>
                <a-form :model="importApiForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off" style="height: 150px;padding-top: 30px">
                    <a-form-item label="URL" name="url" :rules="[{ required: true, message: 'Please input url!' }]" st>
                        <a-input v-model:value="importApiForm.url" placeholder="请输入swagger api文档地址" />
                    </a-form-item>
                </a-form>
            </a-tab-pane>
            <a-tab-pane key="2" tab="导入页面权限">
                <div style="padding: 32px 32px;">
                    <inbox-outlined /><span>是否将本系统最新页面信息上传?</span>
                </div>
            </a-tab-pane>
            <a-tab-pane key="3" tab="导入按钮权限">
                <div style="padding: 32px 32px;">
                    <inbox-outlined /><span>是否将本系统最新页面按钮信息上传?</span>
                </div>
            </a-tab-pane>
        </a-tabs>
    </a-modal>
</template>
<script setup>
import { queryPermission, updatePermission, deletePermission, importApiPerms, importPagePerms, importButtonPerms } from '@/api/permission';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive, computed } from 'vue';
import { ExclamationCircleOutlined,InboxOutlined } from '@ant-design/icons-vue';
import PermissionAdd from './components/PermissionAdd.vue';
import PermissionEdit from './components/PermissionEdit.vue';
import { formatTimestamp } from '@/utils/time';
import homeRouter from '@/router/home';
import btns from '@/config/btn';

import { useStore } from 'vuex';
const store = useStore();
const showAddBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('add-permission-btn') > -1  || store.state.buttonPermList.indexOf('all-permission-btn') > -1 
});
const showImportBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('import-permission-btn') > -1  || store.state.buttonPermList.indexOf('all-permission-btn') > -1 
});
const showDelBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('del-permission-btn') > -1  || store.state.buttonPermList.indexOf('all-permission-btn') > -1 
});
const showEditBtn = computed(() => {
    return store.state.currentUser.superAdmin || store.state.buttonPermList.indexOf('edit-permission-btn') > -1  || store.state.buttonPermList.indexOf('all-permission-btn') > -1 
});
const activeTab = ref("1");
const dataSource = ref([]);
const columns = reactive([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '内部使用',
        dataIndex: 'internal',
        key: 'internal',
    },
    {
        title: '匿名访问',
        dataIndex: 'anon',
        key: 'anon',
    },
    {
        title: '登录访问',
        dataIndex: 'login',
        key: 'login',
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
const showPermissionAddDrawer = ref(false);
const showPermissionEditDrawer = ref(false);
const showImportModal = ref(false);
const permission = ref({});
const queryForm = ref({
    type: null,
    anon: null,
    internal: null,
    login: null,
    name: null
})
const importApiForm = reactive({
    url: null
})
onMounted(() => {
    handleQueryPermission();
});
const handleQueryPermission = () => {
    queryPermission({
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
const onAddSuccess = (permission) => {
    message.success('添加成功');
    handleQueryPermission();
    showPermissionAddDrawer.value = false;
}
const handleUpdatePermission = (permission) => {
    updatePermission(permission).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryPermission();
            showPermissionEditDrawer.value = false;
        }
    });
}
const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryPermission();
}
const onAddClick = () => {
    showPermissionAddDrawer.value = true;
};
const onEditClick = (record) => {
    showPermissionEditDrawer.value = true;
    permission.value = record;
};
const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该权限吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deletePermission({ id }).then((res) => {
                    if (!res.code) {
                        handleQueryPermission();
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
        showPermissionAddDrawer.value = false;
    } else {
        showPermissionEditDrawer.value = false;
    }
}
const onImportClick = () =>{
    showImportModal.value = true;
}
const changeTab = (activeKey) => {
    console.log('tab changed',activeKey);
    activeTab.value = activeKey;
}
const handleImport = () => {
    if(activeTab.value == '1' && importApiForm.url) {
        importApiPerms(importApiForm).then(res => {
            if(!res.code) {
                handleQueryPermission();
                message.success('导入成功');
                showImportModal.value = false;
                importApiForm.url = null;
            }
        })
    } else if(activeTab.value == '2') {
        const pages = convertRouter(homeRouter);
        importPagePerms({
            pages
        }).then(res => {
            if(!res.code) {
                handleQueryPermission();
                message.success('导入成功');
                showImportModal.value = false;
            }
        })
    } else if(activeTab.value == '3') {
        importButtonPerms({
            btns
        }).then(res => {
            if(!res.code) {
                handleQueryPermission();
                message.success('导入成功');
                showImportModal.value = false;
            }
        })
    }
}

const convertRouter = (srcRoutes) => {
    let destRoutes = [];
    for (const item of srcRoutes) {
        let destItem = {
            name: item.name,
            path: item.path,
            ...item.meta        
        }
        if(item.children && item.children.length > 0) {
            destItem.children = convertRouter(item.children);
        }
        destRoutes.push(destItem);
    }
    return destRoutes;
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>