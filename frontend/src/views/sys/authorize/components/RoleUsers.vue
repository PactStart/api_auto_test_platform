<template>
    <div>
        <a-card title="" size="small">
            <template #extra>
                <a-button type="primary" @click="onAddBindingBtnClick">添加关联</a-button>
                <a-button type="primary" danger style="margin-left: 10px;" @click="handleCancelBindings">取消关联
                </a-button>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索昵称、用户名、手机号、邮箱"
                    enter-button="查询" @search="handleQueryUser" />
            </div>
            <div style="margin: 16px 0px">
                <template v-if="hasSelected">
                {{ `选中了 ${selectedRowKeys.length} 个用户` }}
                </template>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" size="small" :rowKey="'id'">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'updateTime'">
                        <span>
                            {{ formatTimestamp(record.updateTime) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onUnBindClick(record)">取消关联</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-drawer title="添加关联" :width="800" :visible="showShowAddBindingDrawer" :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }" @close="closeAddBindingDrawer">
            <SelectUser :roleId=currentRoleId :onConfirmSelect="handleAddBindings" />
        </a-drawer>
    </div>
</template>
<script>
import { bindUsers, unbindUsers, listUsers } from '@/api/role';
import { ref, reactive, onMounted, watch, createVNode, toRefs, computed } from 'vue';
import SelectUser from './SelectUser.vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

export default {
    props: ["roleId"],
    components: {
        SelectUser,
    },
    setup(props) {
        const currentRoleId = ref(props.roleId);
        watch(props, (newValue, oldValue) => {
            // console.log("roleId changed", newValue, oldValue);
            currentRoleId.value = newValue.roleId;
            handleQueryUser();
        }, { immediate: false, deep: true });

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
        onMounted(() => {
            handleQueryUser();

        });
        const handleQueryUser = () => {
            if(!currentRoleId.value) {
                return;
            }
            listUsers({
                roleId: currentRoleId.value,
                page: pagination.value.current,
                size: pagination.value.pageSize,
                keyword: keyword.value
            }).then(res => {
                if (!res.code) {
                    dataSource.value = res.data.list;
                    pagination.value.total = res.data.total;
                }
            });
        };
        const handleTableChange = (page, filters, sorter) => {
            pagination.value.current = page.current;
            pagination.value.pageSize = page.pageSize;
            handleQueryUser();
        };
        const showShowAddBindingDrawer = ref(false);
        const onAddBindingBtnClick = () => {
            showShowAddBindingDrawer.value = true;
        };
        const closeAddBindingDrawer = () => {
            showShowAddBindingDrawer.value = false;
        };
        const handleAddBindings = (userIds) => {
            if(userIds && userIds.length) {
                Modal.confirm({
                title: '添加关联?',
                icon: createVNode(ExclamationCircleOutlined),
                content:  `是否添加对这些用户的关联`,
                    onOk() {
                        return new Promise((resolve, reject) => {
                            bindUsers({
                            roleId: currentRoleId.value,
                            userIds: userIds
                        }).then(res => {
                            if(!res.code) {
                                handleQueryUser();
                                resolve();
                                message.success('关联成功');
                                showShowAddBindingDrawer.value = false;
                            }
                        })
                        }).catch(() => console.log('Oops errors!'));
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onCancel() { },
                });
            }
        };
        const state = reactive({
            selectedRowKeys: [],
        });
        const hasSelected = computed(() => state.selectedRowKeys.length > 0);
        const onSelectChange = selectedRowKeys => {
            // console.log('selectedRowKeys changed: ', selectedRowKeys);
            state.selectedRowKeys = selectedRowKeys;
        };
        const handleCancelBindings = () => {
            console.log(hasSelected)
            if(!hasSelected.value) {
                message.info('请先选择用户');
                return;
            }
            Modal.confirm({
                title: '取消关联?',
                icon: createVNode(ExclamationCircleOutlined),
                content:  `是否确定取消对这些用户的关联`,
                onOk() {
                    return new Promise((resolve, reject) => {
                        unbindUsers({
                        roleId: currentRoleId.value,
                        userIds: state.selectedRowKeys
                    }).then(res => {
                        if(!res.code) {
                            handleQueryUser();
                            resolve();
                            message.success('取消关联成功')
                        }
                    })
                    }).catch(() => console.log('Oops errors!'));
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onCancel() { },
            });
        };
        const onUnBindClick = record => {
            Modal.confirm({
                title: '取消关联?',
                icon: createVNode(ExclamationCircleOutlined),
                content:  `是否确定取消对该用户 ‘${record.nickname}’ 的关联`,
                onOk() {
                    return new Promise((resolve, reject) => {
                        unbindUsers({
                        roleId: currentRoleId.value,
                        userIds: [record.id]
                    }).then(res => {
                        if(!res.code) {
                            handleQueryUser();
                            resolve();
                            message.success('取消关联成功')
                        }
                    })
                    }).catch(() => console.log('Oops errors!'));
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onCancel() { },
            });
        };
        return {
            currentRoleId,
            keyword,
            dataSource,
            columns,
            pagination,
            handleQueryUser,
            handleTableChange,
            showShowAddBindingDrawer,
            onAddBindingBtnClick,
            closeAddBindingDrawer,
            handleAddBindings,
            handleCancelBindings,
            onUnBindClick,
            ...toRefs(state),
            hasSelected,
            onSelectChange,
        }
    }
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>