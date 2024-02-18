<script setup lang="ts">
import type { RoleInfo } from '@/api/role.type'

import { createRole, updateRole } from '@/api/role'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})

const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data: RoleInfo) => {
  if (data.id) {
    setModalProps({ title: '编辑角色' })
    setPathsValue(data)
  }
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updateRole(result) : await createRole(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增角色" class="!w-120" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm" />
  </Modal>
</template>

<style scoped></style>
