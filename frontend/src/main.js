import { createApp } from 'vue'
import App from './App.vue'
import './common/base.css'


import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'

import router from './router/index'

import JsonViewer from "vue3-json-viewer";
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

createApp(App).use(Antd).use(router).use(JsonViewer).mount('#app')

// createApp(App).mount('#app')
