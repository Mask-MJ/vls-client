<script setup lang="ts">
import { importValveData } from '@/api/project/factory'
import { useModalInner } from '@/components/Modal'
import type { UploadFileInfo } from 'naive-ui'

const factoryId = ref<number>()
const fileList = ref<UploadFileInfo[]>([])
const [registerModal, { closeModal }] = useModalInner((data) => {
  factoryId.value = data.id
  fileList.value = []
})

const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (
    [
      'xlsx',
      'xls',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ].includes(data.file.file?.type as string)
  ) {
    return true
  } else {
    window.$message.error(`只能上传 xlsx | xls 格式的文件，请重新上传`)
    return false
  }
}

// Why: 旧实现只看 HTTP status === 201 就弹"导入成功",但后端 try-catch 把每行 valve
// 写入失败吞进 skipped,即使 created=0 也照样返回 201 → 用户看到"成功"但客户下空空。
// 现在读 response.data 真实数字,区分"全失败/部分失败/全成功"三态。
const submit = async () => {
  try {
    const result = await importValveData({
      file: fileList.value[0].file as File,
      fileName: fileList.value[0].name,
      factoryId: factoryId.value
    })
    const body = (result?.data ?? {}) as {
      success?: boolean
      total?: number
      created?: number
      updated?: number
      skipped?: number
      skippedRows?: Array<{ row: number; reason: string }>
    }
    if (result.status !== 201 || body.success === false) {
      window.$message.error('导入失败')
      return
    }
    const total = Number(body.total ?? 0)
    const created = Number(body.created ?? 0)
    const updated = Number(body.updated ?? 0)
    const skipped = Number(body.skipped ?? 0)
    if (created === 0 && updated === 0) {
      const firstReason = body.skippedRows?.[0]?.reason
      window.$message.error(
        `导入失败:共 ${total} 行全部跳过${firstReason ? `(首条原因:${firstReason})` : ''},请联系技术人员排查`
      )
      return
    }
    const parts: string[] = [`新增 ${created} 条`]
    if (updated > 0) parts.push(`更新 ${updated} 条`)
    if (skipped > 0) parts.push(`跳过 ${skipped} 条`)
    window.$message.success(`导入成功:${parts.join(',')}`)
    closeModal()
  } catch (error) {
    window.$message.error('导入失败')
  }
}
</script>

<template>
  <Modal title="导入列表" class="!w-200" @register="registerModal" @positive-click="submit">
    <n-upload
      multiple
      directory-dnd
      name="file"
      :max="1"
      v-model:file-list="fileList"
      @before-upload="beforeUpload"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <i class="i-ant-design:cloud-upload-outlined"></i>
          </n-icon>
        </div>
        <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </n-p>
      </n-upload-dragger>
    </n-upload>
  </Modal>
</template>
