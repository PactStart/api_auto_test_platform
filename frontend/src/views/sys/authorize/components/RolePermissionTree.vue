<template>
    <div>
        <a-button type="primary" @click="onSaveBtnClick" style="margin-bottom: 16px;">
            保存
        </a-button>
        <a-tree v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys" :defaultExpandAll="defaultExpandAll"
            v-model:checkedKeys="checkedKeys" checkable :tree-data="treeData">
            <template #title="{ title, key }">
                <span>{{ title }}</span>
            </template>
        </a-tree>
        
    </div>
</template>
<script>
import { defineComponent, ref, watch ,onMounted } from 'vue';
import {listPermissionTree, assignPermissions} from '@/api/role';
import { message } from 'ant-design-vue';
export default defineComponent({
    props:['roleId'],
    setup(props) {
        const currentRoleId = ref(props.roleId);
        const treeData = ref([]);
        const selectedKeys = ref([]);
        const expandedKeys = ref([]);
        const checkedKeys = ref([]);
        const defaultExpandAll = ref(false);

        watch(props, (newValue, oldValue) => {
            // console.log("roleId changed", newValue, oldValue);
            currentRoleId.value = newValue.roleId;
            handleListPermissionTree();
        }, { immediate: false, deep: true });

        onMounted(() => {
            handleListPermissionTree();
        })

        const handleListPermissionTree = () => {
            listPermissionTree({
                roleId:currentRoleId.value
            }).then(res => {
                if(!res.code) {
                    treeData.value = res.data.permissionTree
                    checkedKeys.value = res.data.ownPermissionIds;
                    defaultExpandAll.value = true;
                }
            })
        }
        
        watch(expandedKeys, () => {
        });
        watch(selectedKeys, () => {
        });
        watch(checkedKeys, () => {
        });
        const onSaveBtnClick = () => {
            let permissionIds = checkedKeys.value.filter(item => {
                return item > 0
            })
            assignPermissions({
                roleId: currentRoleId.value,
                permissionIds
            }).then(res => {
                if(!res.code) {
                    message.success('保存成功')
                }
            })
        }
        return {
            treeData,
            expandedKeys,
            selectedKeys,
            checkedKeys,
            defaultExpandAll,
            onSaveBtnClick
        };
    }
});
</script>
<style lang='less' scoped>

</style>