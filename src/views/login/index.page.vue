<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import Earth from './Earth/index.vue'

const { t } = useI18n()
const userStore = useUserStore()

const formRef = ref<HTMLElement & FormInst>()
const rememberMe = ref(false)
const model = reactive({
  account: '',
  password: ''
})

const handleSubmit = async () => {
  await formRef.value?.validate()
  userStore.login(model)
}
</script>

<template>
  <div class="relative wh-full">
    <Earth />
    <div class="loginForm">
      <header class="text-center">
        <n-gradient-text type="primary" :size="28">
          VLS阀门全生命周期 <br />
          信息管理系统
          <!-- {{ t('app.name') }} -->
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
                class="bg-#fff9"
                v-model:value="model.account"
                :placeholder="t('login.accountPlaceholder')"
              />
            </n-form-item>
            <n-form-item path="password">
              <n-input
                class="bg-#fff9"
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
              <n-button type="primary" size="large" :block="true" @click="handleSubmit">
                {{ t('login.submit') }}
              </n-button>
            </n-space>
          </n-form>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loginForm {
  position: absolute;
  top: calc(50% - 250px);
  right: 10%;
  background-color: rgba($color: #fff, $alpha: 0.8);
  width: 350px;
  height: 450px;
  border-radius: 24px;
  padding: 32px 24px;
}
</style>

<route lang="yaml">
meta:
  layout: login
  noAuth: true
</route>
