<template>
    <div>
        <a-card title="" size="small">
            <template #extra>
                <a-button type="primary">添加关联</a-button>
                <a-button type="dashed" danger style="margin-left: 10px;">取消关联</a-button>
            </template>
            <div class="search-wrapper">
                <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索昵称、用户名、手机号、邮箱" enter-button="查询"
                @search="handleQueryUser" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"
                size="small">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'updateTime'">
                        <span>
                            {{ formatTimestamp(record.updateTime) }}
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onUnBindClick(record.userId)">=取消关联</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>
<script>
import { assignUsers, bindUsers, unbindUsers, listUsers } from '@/api/role';
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
            if (props.roleId) {
                handleQueryUser();
            }
        });
        const handleQueryUser = () => {
            listUsers({
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
        const onUnBindClick = (userId) => {

        };
        return {
            keyword,
            dataSource,
            columns,
            pagination,
            handleQueryUser,
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