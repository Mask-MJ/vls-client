<script setup lang="ts">
import type { FormInst } from 'naive-ui'

import { mixinColor } from '@/utils'

const { t } = useI18n()
const userStore = useUserStore()
const themeStore = useThemeStore()

const formRef = ref<HTMLElement & FormInst>()
const rememberMe = ref(false)
const model = reactive({
  account: 'admin',
  password: '123456'
})

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff'
  const ratio = themeStore.darkMode ? 0.5 : 0.2
  return mixinColor(COLOR_WHITE, themeStore.themeColor, ratio)
})

const handleSubmit = async () => {
  await formRef.value?.validate()
  userStore.login(model)
}
</script>

<template>
  <div class="wh-full flex-center" :style="{ backgroundColor: bgColor }">
    <n-card :bordered="false" size="large" class="z-4 !w-auto rounded-20px shadow-sm">
      <div class="w-300px sm:w-360px">
        <header class="flex-y-center justify-between">
          <n-image width="40" src="/logo.svg" />
          <n-gradient-text type="primary" :size="28">
            {{ t('app.name') }}
          </n-gradient-text>
        </header>
        <main class="pt-24px">
          <h3 class="text-18px text-primary font-medium">
            {{ t('login.passwordType') }}
          </h3>
          <div class="pt-24px">
            <n-form
              ref="formRef"
              :model="model"
              :rules="{ password: [{ required: true, message: t('login.passwordPlaceholder') }] }"
              size="large"
              :show-label="false"
            >
              <n-form-item path="account">
                <n-input
                  v-model:value="model.account"
                  :placeholder="t('login.accountPlaceholder')"
                />
              </n-form-item>
              <n-form-item path="password">
                <n-input
                  v-model:value="model.password"
                  type="password"
                  show-password-on="click"
                  :placeholder="t('login.passwordPlaceholder')"
                />
              </n-form-item>
              <n-space :vertical="true" :size="24">
                <div class="flex-y-center justify-between">
                  <n-checkbox v-model:checked="rememberMe">
                    {{ t('login.remember') }}
                  </n-checkbox>
                </div>
                <n-button
                  type="primary"
                  size="large"
                  :block="true"
                  :round="true"
                  @click="handleSubmit"
                >
                  {{ t('login.submit') }}
                </n-button>
              </n-space>
            </n-form>
          </div>
        </main>
      </div>
    </n-card>
  </div>
</template>

<style lang="" scoped></style>

<route lang="yaml">
meta:
  layout: login
</route>
