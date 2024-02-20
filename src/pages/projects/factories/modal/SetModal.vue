<script setup lang="ts">
import type { FactorysInfo } from '@/api/factory.type'

import { createFactorys, updateFactorys } from '@/api/factory'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})

const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data: FactorysInfo) => {
  if (data.id) {
    setModalProps({ title: '编辑工厂' })
    setPathsValue(data)
  }
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updateFactorys(result) : await createFactorys(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增工厂" class="!w-120" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm">
      <template #customSlot="{ model, field }">
        <n-input-group>
          <n-input v-model:value="model[field]" />
          <n-input-group-label class="flex-center cursor-pointer">
            <i class="text-xl i-line-md:map-marker"></i>
          </n-input-group-label>
        </n-input-group>
      </template>
    </Form>
  </Modal>
</template>

<style scoped></style>
