<script setup lang="ts">
import { importValveData } from '@/api/project/factory'
import { useModalInner } from '@/components/Modal'
import type { DataTableColumns, UploadFileInfo } from 'naive-ui'

type SkippedRow = { row: number; reason: string }
type ImportResult = {
  success?: boolean
  total?: number
  created?: number
  updated?: number
  skipped?: number
  skippedRows?: SkippedRow[]
}

const factoryId = ref<number>()
const fileList = ref<UploadFileInfo[]>([])
const stage = ref<'upload' | 'result'>('upload')
const result = ref<ImportResult>({})

const reset = () => {
  fileList.value = []
  stage.value = 'upload'
  result.value = {}
}
const [registerModal, { closeModal }] = useModalInner((data) => {
  factoryId.value = data.id
  reset()
})

const beforeUpload = async (data: { file: UploadFileInfo }) => {
  const ok = [
    'xlsx',
    'xls',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ].includes(data.file.file?.type as string)
  if (!ok) window.$message.error('只能上传 xlsx | xls 格式的文件, 请重新上传')
  return ok
}

const alertType = computed<'success' | 'warning' | 'error'>(() => {
  const { created = 0, updated = 0, skipped = 0 } = result.value
  if (created === 0 && updated === 0) return 'error'
  if (skipped > 0) return 'warning'
  return 'success'
})

const alertTitle = computed(() => {
  const { total = 0, created = 0, updated = 0, skipped = 0 } = result.value
  if (created === 0 && updated === 0) {
    return `导入失败: 共 ${total} 行全部跳过, 请查看下方明细`
  }
  if (skipped > 0) {
    return `部分导入: 共 ${total} 行 · 新增 ${created} · 更新 ${updated} · 跳过 ${skipped}`
  }
  return `导入成功: 共 ${total} 行 · 新增 ${created}${updated ? ` · 更新 ${updated}` : ''}`
})

const skippedColumns: DataTableColumns<SkippedRow> = [
  { title: '行号', key: 'row', width: 100, align: 'center' },
  { title: '跳过原因', key: 'reason' }
]

// Why: 后端已经在 skippedRows 里给了每行失败原因, 旧实现只把首条塞 toast 一秒关掉,
// 用户根本看不清哪些行没导进去 → 改成两态 modal (上传 / 结果), 结果态展示汇总 alert +
// n-data-table 明细, 用户能拷贝行号回去核对 xlsx。全成功仍走 toast + 自动关。
const submit = async () => {
  if (stage.value === 'result') {
    closeModal()
    return
  }
  if (fileList.value.length === 0) {
    window.$message.warning('请先选择文件')
    return
  }
  try {
    const res = await importValveData({
      file: fileList.value[0].file as File,
      fileName: fileList.value[0].name,
      factoryId: factoryId.value
    })
    const body = (res?.data ?? {}) as ImportResult
    if (res.status !== 201 || body.success === false) {
      window.$message.error('导入失败')
      return
    }
    result.value = body
    const created = Number(body.created ?? 0)
    const updated = Number(body.updated ?? 0)
    const skipped = Number(body.skipped ?? 0)
    if (skipped > 0 || (created === 0 && updated === 0)) {
      stage.value = 'result'
      return
    }
    const parts = [`新增 ${created} 条`]
    if (updated > 0) parts.push(`更新 ${updated} 条`)
    window.$message.success(`导入成功: ${parts.join(', ')}`)
    closeModal()
  } catch {
    window.$message.error('导入失败')
  }
}
</script>

<template>
  <Modal
    title="导入列表"
    class="!w-200"
    :positive-text="stage === 'result' ? '关闭' : '确定'"
    :negative-text="stage === 'result' ? undefined : '取消'"
    @register="registerModal"
    @positive-click="submit"
  >
    <template v-if="stage === 'upload'">
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
    </template>
    <template v-else>
      <n-alert :type="alertType" :title="alertTitle" class="mb-4" />
      <n-data-table
        v-if="result.skippedRows?.length"
        size="small"
        :columns="skippedColumns"
        :data="result.skippedRows"
        :max-height="360"
        :bordered="true"
      />
    </template>
  </Modal>
</template>
