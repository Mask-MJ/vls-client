import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_PROXY } = loadEnv(mode, process.cwd())
  return {
    base: VITE_PUBLIC_PATH,
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      port: Number(VITE_PORT) || 3100,
      host: true,
      proxy: {
        '/api': {
          target: VITE_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    esbuild: { pure: ['console.log', 'console.info', 'console.error'] },
    plugins: [
      VueRouter({ dts: './types/typed-router.d.ts', extensions: ['.page.vue'] }),
      vue(),
      vueJsx(),
      mkcert(),
      VueI18nPlugin({
        runtimeOnly: true,
        include: [path.resolve(process.cwd(), 'src/locales/lang/**')]
      }),
      Unocss(),
      Layouts(),
      // ClientSideLayout({ layoutDir: 'src/layouts', defaultLayout: 'default', importMode: 'async' }),
      AutoImport({
        imports: [
          'vue',
          'vue-i18n',
          VueRouterAutoImports,
          unheadVueComposablesImports,
          '@vueuse/core',
          { 'vue-router/auto': ['useLink'] },
          { 'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'] }
        ],
        vueTemplate: true,
        dirs: ['src/store/modules', 'src/components/Common'],
        dts: 'types/auto-imports.d.ts'
      }),
      Components({ dts: 'types/components.d.ts', resolvers: [NaiveUiResolver()] })
    ]
  }
})
