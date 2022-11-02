<template>
    <div>
        <a-card title="" size="small">
            <template #extra>
                <a-button type="primary">添加关联</a-button>
                <a-button type="dashed" danger style="margin-left: 10px;">取消关联</a-button>
            </template>
            <div class="search-wrapper">
                <a-form>
                    <a-row :gutter="24">
                        <a-col :span="4">
                            <a-form-item label="类型" name="type">
                                <a-select v-model:value="queryForm.type" style="width: 120px" allowClear>
                                    <a-select-option value="API">API接口</a-select-option>
                                    <a-select-option value="PAGE">页面</a-select-option>
                                    <a-select-option value="BUTTON">按钮</a-select-option>
                                    <a-select-option value="DATA">数据</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="是否内部" name="internal">
                                <a-select v-model:value="queryForm.internal" style="width: 120px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="匿名访问" name="anon">
                                <a-select v-model:value="queryForm.anon" style="width: 120px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="登录访问" name="login">
                                <a-select v-model:value="queryForm.login" style="width: 120px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="权限名" name="name">
                                <a-input-search v-model:value="queryForm.name" style="width: 300px"
                                    placeholder="模糊搜索权限名" enter-button="查询" @search="handleQueryPermission" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange" size="small">
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
</template>
<script>
import { assignPermissions, bindPermissions, unbindPermissions, listPermissions } from '@/api/role';
import { ref, reactive, onMounted } from 'vue';
export default {
    props: ["roleId"],
    setup(props) {
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
                title: '关联时间',
                dataIndex: 'updateat',
                key: 'createAt',
            },
            {
                title: '操作',
                key: 'action',
            }
        ]);
        const pagination = ref({
            current: 1,
            pageSize: 10,
            total: 0
        });
        const queryForm = ref({
            type: null,
            anon: null,
            internal: null,
            login: null,
            name: null
        })
        onMounted(() => {
            if (props.roleId) {
                handleQueryPermission();
            }
        });
        const handleQueryPermission = () => {
            listPermissions({
                page: pagination.value.current,
                size: pagination.value.pageSize,
                ...queryForm.value
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
            handleQueryPermission();
        };
        const onUnBindClick = (userId) => {

        };
        return {
            dataSource,
            columns,
            pagination,
            queryForm,
            handleQueryPermission,
            handleTableChange
        }
    }
}

</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>