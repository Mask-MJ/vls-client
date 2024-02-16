<script setup lang="ts">
import { resetPassword } from '@/api/user'
import { useForm } from '@/components/Form'
import { useModalInner } from '@/components/Modal'

import { resetSchemas } from './data'

const [registerForm, { validate, getPathsValue, setPathsValue }] = useForm({
  labelWidth: 100,
  schemas: resetSchemas
})
const [registerModal, { closeModal }] = useModalInner(async (data) => {
  setPathsValue(data)
})

const handleSubmit = async () => {
  try {
    await validate()
    const result = getPathsValue()
    await resetPassword(result)
    window.$message.success(`修改成功，新密码是：${result.password}`)
    closeModal()
  } catch {
    window.$message.error('操作失败')
  }
}
</script>

<template>
  <Modal title="重置密码" @register="registerModal" @positive-click="handleSubmit">
    <Form @register="registerForm" />
  </Modal>
</template>
