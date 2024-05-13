import './assets/main.css'

import { createApp } from 'vue'
import PolarisVue from '@ownego/polaris-vue'
import App from './App.vue'
import '@ownego/polaris-vue/dist/style.css'

createApp(App).use(PolarisVue).mount('#app')