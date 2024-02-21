<script setup lang="ts">
import type { TransferOption } from 'naive-ui'
import type { FactorysInfo } from '@/api/factory.type'
import type { UserInfo } from '@/api/user.type'

import { createFactory, updateFactory } from '@/api/factory'
import { getUsersList } from '@/api/user'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const userStore = useUserStore()
const options = ref<UserInfo[]>([])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})

const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data: FactorysInfo) => {
  options.value = await getUsersList()
  if (data.id) {
    setModalProps({ title: '编辑工厂' })
    setPathsValue(data)
  }
})

const getOptions = computed(() => {
  return options.value.map((item) => ({
    value: item.id,
    label: item.nickname,
    disabled: userStore.getUserInfo.id === item.id
  })) as TransferOption[]
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updateFactory(result) : await createFactory(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增工厂" class="!w-200" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm">
      <template #customSlot="{ model, path }">
        <n-input-group>
          <n-input v-model:value="model[path]" disabled />
          <n-input-group-label class="flex-center cursor-pointer">
            <i class="text-xl i-line-md:map-marker"></i>
          </n-input-group-label>
        </n-input-group>
      </template>
      <template #transferSlot="{ model, path }">
        <n-transfer ref="transfer" v-model:value="model[path]" :options="getOptions" />
      </template>
    </Form>
  </Modal>
</template>

<style scoped></style>
