<template>
<div style="display:inline-block ;">
    <a-select v-model:value="appId" placeholder="请选择应用" style="width: 100%"
                    :filter-option="false" :not-found-content="fetching ? undefined : null" :options="appList" :showSearch="true" :disabled = "readonly"
                    @search="handleQueryApp()" @change="change" allowClear >
        <template v-if="fetching" #notFoundContent>
            <a-spin size="small" />
        </template>
    </a-select>
</div>
</template>
<script>
    import { queryApp } from '@/api/app';
    import { ref,onMounted } from 'vue';
    import { debounce } from 'lodash-es';
    export default {
        props:["appId","readonly"],
        emits:{
            "update:appId": val => {
                return val
            }
        },
        setup(props,context) {
            const readonly = ref(props.readonly);
            const appId = ref(props.appId);
            const fetching = ref(false);
            const appList = ref([]);

            let lastFetchId = 0;
            const handleQueryApp = debounce((value) => {
                fetching.value = true;
                lastFetchId += 1;
                const fetchId = lastFetchId;
                queryApp({
                    page: 1,
                    size: 10,
                    name: value
                }).then(res => {
                    if (fetchId !== lastFetchId) {
                        // for fetch callback order
                    return;
                    }
                    if (!res.code) {
                        appList.value = res.data.list.map(app => ({
                            label: app.name,
                            value: app.id,
                        }));
                    }
                    fetching.value = false;
                })
            },300);
            onMounted(() => {
                handleQueryApp();
            })
            const change = (value,option) => {
                if(value === undefined) {
                    context.emit('update:appId',null);
                } else {
                    context.emit('update:appId',value);
                }
            };
            return {
                readonly,
                appId,
                fetching,
                appList,
                change,
                handleQueryApp
            }
        }
    }
</script>
<style lang='less' scoped>
    
</style>