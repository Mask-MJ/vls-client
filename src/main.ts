import 'uno.css'
import '@/styles/index.scss'

import App from './App.vue'
import { createHead } from '@unhead/vue'
import { createApp } from 'vue'

import { setupI18n } from './locales'
import { setupRouter } from './router'
import { setupStore } from './store'

const app = createApp(App)
const head = createHead()

app.use(head)
// 配置 store
setupStore(app)
// 多语言
setupI18n(app)
// 配置路由
setupRouter(app)

app.mount('#app')
