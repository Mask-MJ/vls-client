import 'uno.css'
import '@/styles/index.scss'

import App from './App.vue'
import { createHead } from '@unhead/vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { setupI18n } from './lacales'
import { setupRouter } from './router'

const app = createApp(App)
const head = createHead()

app.use(head)
// 配置 store
app.use(createPinia())
// 多语言
setupI18n(app)
// 配置路由
setupRouter(app)

app.mount('#app')
