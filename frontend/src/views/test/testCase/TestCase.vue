<template>
    <div>
        <a-card title="用例管理">
            <template #extra>
                <a @click="onDrawerOpen('batch_create_default_case')">批量创建</a>
                <a-divider type="vertical" />
                <a @click="onDrawerOpen('batch_set_pre_case')">设置前置用例</a>
            </template>
            <div class="search-wrapper">
                <label>选择应用：</label><AppSelectVue v-model:appId="queryForm.appId" style="width: 200px;" @update:appId="appId = $event" />
                <label> 接口ID: </label><a-input-number v-model:value="queryForm.apiId" :min="1" placeholder="请输入API id"
                    style="width: 200px;" />
                <label> 前置用例: </label><a-input-number v-model:value="queryForm.preCaseId" :min="1" placeholder="请输入用例 id"
                style="width: 200px;" />
                <a-input-search v-model:value="queryForm.name" style="width: 350px; margin-left: 20px;" placeholder="模糊搜索用例名称"
                    enter-button="查询" @search="handleQueryTestCase" />
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="handleTableChange" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }" size="small" :rowKey="'id'">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'run'">
                        <span v-if="record.run">
                            <check-outlined />
                        </span>
                        <span v-else>
                            <close-outlined />
                        </span>
                    </template>
                    <template v-if="column.key === 'preCaseId'">
                        <span v-if="!record.preCaseId">
                            无
                        </span>
                    </template>
                    <template v-if="column.key === 'preFields'">
                        <span v-if="record.preCaseId">
                            <a @click="onViewJsonClick(record.preFields,'前置字段')"><eye-outlined /></a>
                        </span>
                        <span v-else>无</span>
                    </template>
                    <template v-if="column.key === 'headers'">
                        <span>
                            <a @click="onViewJsonClick(record.headers,'请求头')"><eye-outlined /></a>
                        </span>
                    </template>
                    <template v-if="column.key === 'requestBody'">
                        <span>
                            <a @click="onViewJsonClick(record.requestBody,'请求参数')"><eye-outlined /></a>
                        </span>
                    </template>
                    <template v-if="column.key === 'assert'">
                        <span>
                            <a @click="onViewJsonClick(record.assert,'断言')"><eye-outlined /></a>
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
                            <a @click="onDrawerOpen('edit',record)">编辑</a>
                            <a-divider type="vertical" />
                            <a style="color: red;" @click="onDelClick(record.id)">删除</a>
                            <a-divider type="vertical" />
                            <a  @click="onDrawerOpen('clone',record)">克隆</a>
                            <a-divider type="vertical" />
                            <a style="color: green;" @click="onDrawerOpen('debug',record)">调试</a>
                        </span>
                    </template>
                </template>
            </a-table>
            <div>
                <a-button type="primary" v-show="hasSelected" @click="onCreatePlanClick('current_page')">创建计划（当前页选中）</a-button>
                <a-button type="primary" v-show="hasSelected" style="margin-left: 16px;" @click="onCreatePlanClick('cross_page')">创建计划（跨分页选中）</a-button>
            </div>
        </a-card>
    </div>
    <a-drawer title="编辑测试用例" :width="700" :visible="showTestCaseEditDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onDrawerClose('edit')">
        <TestCaseEdit :testCase="testCase" :onSubmit="handleUpdateTestCase" />
    </a-drawer>
    <a-drawer title="为应用设置统一的前置用例" :width="700" :visible="showBatchSetPreCaseDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onDrawerClose('batch_set_pre_case')">
        <BatchSetPreCase :onSubmit="handleBatchSetPreCase" />
    </a-drawer>
    <a-drawer title="批量为应用所有接口创建默认用例" :width="600" :visible="showBatchCreateDefaultCaseDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onDrawerClose('batch_create_default_case')">
        <BatchCreateDefaultCase :onSubmit="handleBatchCreateDefaultCase" />
    </a-drawer>
    <a-drawer title="克隆测试用例" :width="700" :visible="showTestCaseCloneDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onDrawerClose('batch_create_default_case')">
        <TestCaseClone :copyFrom="copyFrom" :onSubmit="handleTestCaseClone" />
    </a-drawer>
    <a-drawer title="调试测试用例" :width="800" :visible="showTestCaseDebugDrawer" :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }" @close="onDrawerClose('debug')">
        <TestCaseDebug :testCase="testCase" />
    </a-drawer>
    <a-modal v-model:visible="showViewJsonModal" :title="title" @ok="showViewJsonModal = !showViewJsonModal" ok-text="关闭">
        <JsonViewer :value="jsonObj" copyable boxed sort theme="jv-light"/>
    </a-modal>
    <a-modal v-model:visible="showCreateTestPlanDrawer" title="创建测试计划" @ok="handleAddTestPlan">
        <a-form :model="testPlanForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
            <a-form-item label="计划名称" name="name" :rules="[{ required: true, message: 'Please input name!' }]" st>
                <a-input v-model:value="testPlanForm.name" placeholder="请输入计划名称" />
            </a-form-item>
            <a-form-item label="BASE URL" name="baseUrl" :rules="[{ required: false, message: 'Please input baseUrl!' }]" st>
                <a-input v-model:value="testPlanForm.baseUrl" placeholder="请输入接口域名,不填写，将默认使用应用的base_url的配置" />
            </a-form-item>
        </a-form>
    </a-modal>

</template>
<script setup>
import { addTestCase, queryTestCase, updateTestCase, deleteTestCase, createDefaultForAll,bactchSetPreCase } from '@/api/testCase';
import { addTestPlan} from '@/api/testPlan';
import { message, Modal } from 'ant-design-vue';
import { ref, onMounted, createVNode, reactive,computed, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { formatTimestamp } from '@/utils/time'
import AppSelectVue from '@/components/AppSelect.vue';
import { EyeOutlined,CheckOutlined,CloseOutlined } from '@ant-design/icons-vue';
import TestCaseEdit from './components/TestCaseEdit.vue';
import BatchSetPreCase from './components/BatchSetPreCase.vue';
import BatchCreateDefaultCase from './components/BatchCreateDefaultCase.vue';
import TestCaseClone from './components/TestCaseClone.vue';
import TestCaseDebug from './components/TestCaseDebug.vue';
import router from '@/router';
import { useRoute } from 'vue-router';

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
        title: 'API ID',
        dataIndex: 'apiId',
        key: 'apiId',
    },
    {
        title: '用例名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '开启执行',
        dataIndex: 'run',
        key: 'run',
    },
    {
        title: '前置用例',
        dataIndex: 'preCaseId',
        key: 'preCaseId',
    },
    {
        title: '前置字段',
        dataIndex: 'preFields',
        key: 'preFields',
    },
    {
        title: '请求头',
        dataIndex: 'headers',
        key: 'headers',
    },
    {
        title: '请求参数',
        dataIndex: 'requestBody',
        key: 'requestBody',
    },
    {
        title: '断言',
        dataIndex: 'assert',
        key: 'assert',
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
    apiId: null,
    preCaseId: null,
    name: null,
});

const route = useRoute();
if(route.query?.appId) {
    queryForm.value.appId = parseInt(route.query.appId);
}
if(route.query?.apiId) {
    queryForm.value.apiId = parseInt(route.query.apiId);
}
const showTestCaseEditDrawer = ref(false);
const showBatchSetPreCaseDrawer = ref(false);
const showBatchCreateDefaultCaseDrawer = ref(false);
const showTestCaseCloneDrawer = ref(false);
const showTestCaseDebugDrawer = ref(false);
const testCase = ref(null);
const copyFrom = ref(null);
const title = ref('');
const jsonObj = ref({});
const showViewJsonModal = ref(false);
const onViewJsonClick = (json,text) => {
    jsonObj.value = JSON.parse(json);
    showViewJsonModal.value = true;
    title.value = text;
};
onMounted(() => {
    watch(
        () => route.query,
        (newValue, oldValue) => {
            // console.log('route.query changed',newValue,oldValue)
            if(newValue?.appId) {
                queryForm.value.appId = parseInt(newValue.appId);
            }
            if(newValue?.apiId) {
                queryForm.value.apiId = parseInt(newValue.apiId);
            }
            handleQueryTestCase();
        },
        { immediate: true }
    );
    handleQueryTestCase();

});
const handleQueryTestCase = () => {
    queryTestCase({
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

const handleTableChange = (page, filters, sorter) => {
    pagination.value.current = page.current;
    pagination.value.pageSize = page.pageSize;
    handleQueryTestCase();
}

const onDelClick = (id) => {
    Modal.confirm({
        title: '确定删除该API吗?',
        icon: createVNode(ExclamationCircleOutlined),
        content: '删除后不可恢复，请谨慎操作',
        onOk() {
            return new Promise((resolve, reject) => {
                deleteTestCase({ id }).then((res) => {
                    if (!res.code) {
                        handleQueryTestCase();
                        resolve();
                    }
                })
            }).catch(() => console.log('Oops errors!'));
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onCancel() { },
    });
};

const onDrawerClose = (type) => {
    if(type == 'edit') {
        showTestCaseEditDrawer.value = false;
    }  else if(type == 'batch_set_pre_case') {
        showBatchSetPreCaseDrawer.value = false;
    } else if(type == 'batch_create_default_case') {
        showBatchCreateDefaultCaseDrawer.value = false;
    }else if(type == 'clone') {
        showBatchCreateDefaultCaseDrawer.value = false;
    } else if(type == 'debug') {
        showTestCaseDebugDrawer.value = false;
    }
};

const onDrawerOpen = (type,record) => {
    if(type == 'edit') {
        showTestCaseEditDrawer.value = true;
        testCase.value = record;
    }  else if(type == 'batch_set_pre_case') {
        showBatchSetPreCaseDrawer.value = true;
    } else if(type == 'batch_create_default_case') {
        showBatchCreateDefaultCaseDrawer.value = true;
     }else if(type == 'clone') {
        showTestCaseCloneDrawer.value = true;
        copyFrom.value = record;
    } else if (type == 'debug') {
        testCase.value = record;
        showTestCaseDebugDrawer.value = true;
    }
};

const handleUpdateTestCase = (testCaseForm) => {
    updateTestCase(testCaseForm).then(res => {
        if (!res.code) {
            message.success('修改成功');
            handleQueryTestCase();
            showTestCaseEditDrawer.value = false;
        }
    });
}

const handleBatchSetPreCase = (data) => {
    bactchSetPreCase(data).then(res => {
        if(!res.code) {
            message.success('设置成功')
            showBatchSetPreCaseDrawer.value = false;
            handleQueryTestCase();
        }
    })
}

const handleBatchCreateDefaultCase = (data) => {
    createDefaultForAll(data).then(res => {
        if(!res.code) {
            message.success('批量创建成功')
            showBatchCreateDefaultCaseDrawer.value = false;
            handleQueryTestCase();
        }
    })
}

const handleTestCaseClone = (data) => {
    addTestCase(data).then(res => {
        if(!res.code) {
            message.success('克隆成功')
            showTestCaseCloneDrawer.value = false;
            handleQueryTestCase();
        }
    })
}

const handleTestCaseRun = () => {
    
}

const state = reactive({
    selectedRowKeys: []
});
const hasSelected = computed(() => state.selectedRowKeys.length > 0);
const showCreateTestPlanDrawer = ref(false);
const onSelectChange = selectedRowKeys => {
    state.selectedRowKeys = selectedRowKeys;
};
const onCreatePlanClick = (type) => {
    if(!queryForm.value.appId) {
        message.error('请先选择应用');
        return;
    }
    showCreateTestPlanDrawer.value = true;
}
const testPlanForm = reactive({
    name: '',
    baseUrl: ''
})
const handleAddTestPlan = ()=> {
    addTestPlan({
        ...testPlanForm,
        chooseAllCase: false,
        appId: queryForm.value.appId,
        caseIds: state.selectedRowKeys,
    }).then(res => {
        if(!res.code) {
            message.success('创建成功');
            router.push('/test/testPlan')
        }
    })
}

</script>
<style lang='less' scoped>
.search-wrapper {
    margin-bottom: 20px;
}
</style>