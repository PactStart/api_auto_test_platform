<template>
    <div>
        <a-card :title="cardTitle">
            <div class="search-wrapper">
                <a-form>
                    <a-row :gutter="24">
                        <a-col :span="4">
                            <a-form-item label="分组" name="groupName">
                                <a-input v-model:value="queryForm.groupName" placeholder="API分组名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="模块" name="moduleName">
                                <a-input v-model:value="queryForm.moduleName" placeholder="API模块名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="API" name="apiName">
                                <a-input v-model:value="queryForm.apiName" placeholder="API名称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item label="是否通过" name="pass">
                                <a-select v-model:value="queryForm.pass" style="width: 150px" allowClear>
                                    <a-select-option value="1">是</a-select-option>
                                    <a-select-option value="0">否</a-select-option>
                                    <a-select-option value="null">未执行</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="用例名称" name="name">
                                <a-input-search v-model:value="queryForm.caseName"
                                    style="width: 350px; margin-left: 20px;" placeholder="模糊搜索用例名称" enter-button="查询"
                                    @search="handleQueryRunLog" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange"
                size="small">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'headers'">
                        <span>
                            <a @click="onViewJsonClick(record.headers, '请求头')">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'requestBody'">
                        <span>
                            <a @click="onViewJsonClick(record.requestBody, '请求参数')">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'response'">
                        <span>
                            <a @click="onViewJsonClick(record.requestBody, '响应')">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'assert'">
                        <span>
                            <a @click="onViewJsonClick(record.assert, '断言')">
                                <eye-outlined />
                            </a>
                        </span>
                    </template>
                    <template v-if="column.key === 'startAt'">
                        <span v-if="column.startAt != null">
                            {{ formatTimestamp(record.startAt) }}
                        </span>

                    </template>
                    <template v-if="column.key === 'pass'">
                        <span v-if="record.pass == null">
                            <minus-outlined />
                        </span>
                        <span v-else-if="record.pass">
                            <check-outlined :style="{ fontSize: '16px', color: 'green' }" />
                        </span>
                        <span v-else>
                            <close-outlined :style="{ fontSize: '16px', color: 'red' }" />
                        </span>
                    </template>
                    <template v-if="column.key === 'action'">
                        <span>
                            <a @click="onDetailClick(record)">详情</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-modal v-model:visible="showViewJsonModal" :title="title" @ok="showViewJsonModal = !showViewJsonModal"
            ok-text="关闭">
            <JsonViewer :value="jsonObj" copyable boxed sort theme="jv-light" />
        </a-modal>
    </div>
</template>
<script>
import { defineComponent, ref, onMounted, reactive, watch, computed } from 'vue';
import { getTestPlan, queryRunLog } from '@/api/testPlan';
import { formatTimestamp } from '@/utils/time'
import { EyeOutlined, CheckOutlined, CloseOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    components: {
        EyeOutlined,
        CheckOutlined,
        CloseOutlined,
        MinusOutlined
    },
    setup() {
        const dataSource = ref([]);
        const columns = reactive([
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '用例名称',
                dataIndex: 'caseName',
                key: 'caseName',
            },
            {
                title: 'API分组',
                dataIndex: 'groupName',
                key: 'groupName',
            },
            {
                title: 'API模块',
                dataIndex: 'moduleName',
                key: 'moduleName',
            },
            {
                title: 'API名称',
                dataIndex: 'apiName',
                key: 'apiName',
            },
            {
                title: 'URL',
                dataIndex: 'url',
                key: 'url',
            },
            {
                title: 'Method',
                dataIndex: 'requestMethod',
                key: 'requestMethod',
            },
            {
                title: '请求头',
                dataIndex: 'headers',
                key: 'headers',
            },
            {
                title: '请求',
                dataIndex: 'requestBody',
                key: 'requestBody',
            },
            {
                title: '响应',
                dataIndex: 'requestBody',
                key: 'requestBody',
            },
            {
                title: '断言',
                dataIndex: 'assert',
                key: 'assert',
            },
            {
                title: '是否通过',
                dataIndex: 'pass',
                key: 'pass',
            },
            {
                title: '断言结果',
                dataIndex: 'msg',
                key: 'msg',
            },
            // {
            //     title: '开始时间',
            //     dataIndex: 'startAt',
            //     key: 'startAt',
            // },
            {
                title: '耗时（ms）',
                dataIndex: 'cost',
                key: 'cost',
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
            groupName: null,
            moduleName: null,
            apiName: null,
            caseName: null,
            pass: null
        })
        const title = ref(null);
        const jsonObj = ref({});
        const showViewJsonModal = ref(false);
        const onViewJsonClick = (json, text) => {
            jsonObj.value = JSON.parse(json);
            showViewJsonModal.value = true;
            title.value = text;
        };
        const route = useRoute();
        const planId = ref(null);
        const plan = ref(null);
        planId.value = route.params.planId;

        const cardTitle = computed(() => `测试报告(${ plan.value ? plan.value.name : ''})`);

        onMounted(() => {
            watch(
                () => route.params,
                (newValue, oldValue) => {
                    console.log('planId changed',newValue,oldValue)
                    planId.value = newValue.planId;
                    handleQueryTestPlan();
                    handleQueryRunLog();
                },
                { immediate: true }
            );
            handleQueryTestPlan();
            handleQueryRunLog();
        });

        const handleQueryTestPlan = () => {
            if(!planId.value) {
                return;
            }
            getTestPlan({
                id: planId.value
            }).then(res => {
                if (!res.code) {
                    plan.value = res.data;
                }
            });
        }
        const handleQueryRunLog = () => {
            if(!planId.value) {
                return;
            }
            let param = {
                planId: planId.value,
                page: pagination.value.current,
                size: pagination.value.pageSize,
                ...queryForm.value
            };
            if (param.pass == 'null' || param.pass == null) {
                param.pass = null;
            } else {
                param.pass = !!param.pass;
            }
            queryRunLog(param).then(res => {
                if (!res.code) {
                    dataSource.value = res.data.list;
                    pagination.value.total = res.data.total;
                }
            });
        }
        const handleTableChange = (page, filters, sorter) => {
            pagination.value.current = page.current;
            pagination.value.pageSize = page.pageSize;
            handleQueryRunLog();
        }
        return {
            dataSource,
            columns,
            pagination,
            queryForm,
            title,
            jsonObj,
            showViewJsonModal,
            onViewJsonClick,
            handleQueryRunLog,
            handleTableChange,
            cardTitle
        };
    }
});
</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>