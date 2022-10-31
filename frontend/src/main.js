import { createApp } from 'vue'
import App from './App.vue'
import './common/base.css'


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'

import router from './router/index'
createApp(App).use(Antd).use(router).mount('#app')

// createApp(App).mount('#app')
