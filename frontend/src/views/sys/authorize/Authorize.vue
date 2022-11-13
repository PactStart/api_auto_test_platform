<template>
<div>
    <a-card title="授权管理">
        <a-row :gutter=24>
            <a-col :span="4">
                <a-card title="角色列表" size="small">
                    <a-input-search v-model:value="roleKeyword" style="width: 100%" placeholder="模糊搜索角色名"
                @search="handleQueryRole" />
                    <a-list item-layout="vertical" :pagination="rolePagination" :data-source="roleDataSource">
                        <template #renderItem="{ item }" >
                            <a-list-item :class="selectedRoleId == item.id ? 'role-active': 'role-disable'">
                                <span @click="onSelectRole(item)" style="margin-left: 16px;">
                                    {{ item.name }}
                                </span>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-card>
            </a-col>
            <a-col :span="20">
                <a-card size="small">
                    <a-tabs>
                        <a-tab-pane key="1" tab="关联用户" force-render>
                            <RoleUsers :roleId="selectedRoleId" />
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="关联权限">
                            <RolePermissionTree :roleId="selectedRoleId" />
                        </a-tab-pane>
                    </a-tabs>
                </a-card>
            </a-col>
        </a-row>
    </a-card>
</div>
</template>
<script setup>
import { queryRole } from '@/api/role';
import { ref, onMounted} from 'vue';
import RolePermissionTree from './components/RolePermissionTree.vue';
import RoleUsers from './components/RoleUsers.vue';

const roleDataSource = ref([]);
const rolePagination = ref({
    current: 1,
    pageSize: 10,
    total: 0
});
const roleKeyword = ref(null);
const selectedRoleId = ref(0);
const handleQueryRole = () => {
    queryRole({
        page: rolePagination.value.current,
        size: rolePagination.value.pageSize,
        name: roleKeyword.value
    }).then(res => {
        if(!res.code) {
            roleDataSource.value = res.data.list;
            rolePagination.value.total = res.data.total;
            if(!selectedRoleId.value && roleDataSource.value.length) {
                selectedRoleId.value = roleDataSource.value[0].id;
            }
        }
    });
};
const onSelectRole = (role) => {
    // message.success(role.name + '选中了');
    selectedRoleId.value = role.id;
}
onMounted(() => {
    handleQueryRole();
});
</script>
<style lang='less' scoped>
    .role-active {
        background-color: #1890ff;
        color: #fff;
    }
</style>