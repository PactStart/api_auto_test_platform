<template>
    <div>
        <div class="search-wrapper">
            <a-input-search v-model:value="keyword" style="width: 350px" placeholder="模糊搜索昵称、用户名、手机号、邮箱"
                enter-button="查询" @search="handleQueryUser" />
        </div>
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" size="small" :rowKey="'id'">
        </a-table>
        <div style="margin-top;: 16px">
            <a-button type="primary" @click="onConfirmBtnClick" :disabled="!hasSelected">
                确定
            </a-button>
        </div>
    </div>
</template>
<script>
import { listUsers } from '@/api/role';
import { ref, reactive, onMounted, toRefs, computed } from 'vue';

export default {
    props: ["roleId", "onConfirmSelect"],
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
            listUsers({
                roleId: props.roleId,
                exclude: true,
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
        const state = reactive({
            selectedRowKeys: [],
        });
        const hasSelected = computed(() => state.selectedRowKeys.length > 0);
        const onSelectChange = selectedRowKeys => {
            // console.log('selectedRowKeys changed: ', selectedRowKeys);
            state.selectedRowKeys = selectedRowKeys;
        };
        const onConfirmBtnClick = () => {
            props.onConfirmSelect(state.selectedRowKeys);
        };

        return {
            keyword,
            dataSource,
            columns,
            pagination,
            ...toRefs(state),
            hasSelected,
            onSelectChange,
            handleQueryUser,
            handleTableChange,
            onConfirmBtnClick
        }
    }
}
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>