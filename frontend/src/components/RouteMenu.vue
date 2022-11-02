<template>
    <!-- 如果存在子路由 -->
    <template v-if="route.children">
        <a-sub-menu :key="route.name" :title="route.meta?.title || '未命名'" :expandIcon="route.open">
            <template #icon>
                <!-- <Icon v-if="route.meta?.icon" :type="route.meta.icon" /> -->
            </template>
            <template v-for="children of route.children">
                <!-- 递归 -->
                <RouteMenu :route="children" />
            </template>
        </a-sub-menu>
    </template>
    <template v-else>
        <a-menu-item :key="route.name" @click="go(route)">
            <!-- <Icon v-if="route.meta?.icon" :type="route.meta.icon" /> -->
            <span class="nav-text"> {{ route.meta?.title || "未命名" }} </span>
        </a-menu-item>
    </template>
</template>

<script>
    import { router } from '../router/index';
    export default {
        props: ['route'],
        setup() {
            const go = function(route) {
                router.push(route.path);
            };
            return {
                go
            }
        }
    }
</script>
<style scope lang="less"></style>

