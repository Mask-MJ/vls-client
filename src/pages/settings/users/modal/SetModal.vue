<script setup lang="ts">
import type { UserInfo } from '@/api/user.type'

import { createUser, updateUser } from '@/api/user'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { schemas } from './data'

const emits = defineEmits(['success', 'register'])
const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas
})

const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data: UserInfo) => {
  if (data.id) {
    setModalProps({ title: '编辑账号' })
    setPathsValue(data)
  }
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    result.id ? await updateUser(result) : await createUser(result)
    emits('success')
    closeModal()
  } catch (error) {
    console.warn(error)
  }
}
</script>

<template>
  <Modal title="新增账号" class="!w-120" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm" />
  </Modal>
</template>

<style scoped></style>
