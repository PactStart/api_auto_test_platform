<template>
    <a-layout>
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible style="background: #fff; padding: 0">
            <div class="logo">
                <span>API自动化测试</span>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
                <template v-for="route of menuRoutes.children">
                    <RouteMenu :route="route" />
                </template> 
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
            </a-layout-header>
            <a-layout-content :style="{ margin: '16px 12px', padding: '12px', background: '#fff', minHeight: '860px' }">
                <router-view></router-view>
            </a-layout-content>
            <a-layout-footer style="text-align: center; height: 50px;">
                API自动化测试平台，github地址：<a href="https://github.com/PactStart/api_auto_test_platform" target="_blank">https://github.com/PactStart/api_auto_test_platform</a>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import RouteMenu from "../components/RouteMenu.vue";
import { menuRoutes } from "../router/index";
console.log(menuRoutes);

export default defineComponent({
    components: {
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        RouteMenu
    },
    setup() {
        return {
            selectedKeys: ref(['user']),
            openKeys: ref(['sys']),
            collapsed: ref(false),
            menuRoutes
        };
    },

});
</script>
<style lang='less' scoped>
.logo {
    height: 32px;
    margin: 16px;
    background: #fff;
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}
</style>