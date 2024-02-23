<script setup lang="ts">
import type { TemplatesInfo } from '@/api/template.type'

import { CreatedTemplate, updatedTemplate } from '@/api/template'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})
const [registerModal, { closeModal, setModalProps }] = useModalInner((data: TemplatesInfo) => {
  if (data.id) {
    setModalProps({ title: '编辑模板' })
    setPathsValue(data)
  }
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updatedTemplate(result) : await CreatedTemplate(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增模板" class="!w-200" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm" />
  </Modal>
</template>

<style scoped></style>
