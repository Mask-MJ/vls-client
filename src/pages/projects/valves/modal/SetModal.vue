<script setup lang="ts">
import type { ValveInfo } from '@/api/valve.type'

import { createValve, updateValve } from '@/api/valve'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})

const [registerModal, { closeModal, setModalProps }] = useModalInner((data: ValveInfo) => {
  if (data.id) {
    setModalProps({ title: '编辑阀门' })
  }
  setPathsValue(data)
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updateValve(result) : await createValve(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增阀门" class="!w-100" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm" />
  </Modal>
</template>

<style scoped></style>
