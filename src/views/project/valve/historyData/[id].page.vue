<script setup lang="ts">
import { getValveDetail, getValveHistoryList } from '@/api/project/valve'
import { useTable } from '@/components/Table'
import { getDictDataList, getDictDataTreeListAll, getDictTypeList } from '@/api/system/dict'
import { flattenDepth, groupBy } from 'lodash-es'
import { Workbook } from 'exceljs'
import dayjs from 'dayjs'

const router = useRouter()
const language = ref<'zh' | 'en'>('zh')
const dictData = ref<any[]>([])
const valveDetail = ref<any>({})
const dictDataTreeList = ref<any[]>([])
// 当前页展平后的采集(每项 = 一次采集, 字段作为 key 平铺在对象上)
const collectionRows = ref<any[]>([])
const valveId = computed(() => (router.currentRoute.value.params as { id: string }).id)

const [registerTable, { setColumns, reload }] = useTable({
  api: getValveHistoryList,
  columns: [{ title: '字段', key: 'fieldName', width: 220, fixed: 'left' }],
  bordered: true,
  searchInfo: { valveId },
  rowKey: (rowData: any) => rowData.fieldKey,
  showToolbars: false,
  showIndexColumn: false,
  // ponytail: 转置视图 — 分页仍按"采集条数"分, itemCount 走后端 total,
  // 表格 rows 变成"字段行", 每列是一次采集。useTable / n-data-table / 分页语义都保持不变。
  afterFetch: async (rows: any[]) => {
    if (!dictDataTreeList.value.length) {
      dictDataTreeList.value = await getDictDataTreeListAll()
    }
    const flat = transformData(rows, dictDataTreeList.value)
    collectionRows.value = flat
    setColumns(buildTransposedColumns(flat))
    return buildTransposedRows(flat)
  }
})

// 展平一条采集: valveHistoryData 数组 → { tag, time, [字段名]: 值 }
const transformData = (data: any[], treeList: any[]) => {
  return data.map((item: any) => {
    const condition: any = {}
    const repeatArray = flattenDepth(
      Object.values(groupBy(item.valveHistoryData, (i: any) => i.name)).filter(
        (value) => value.length > 1
      ),
      1
    )
    item.valveHistoryData.forEach((itm: any) => {
      let value: any = itm.value === null ? '----' : itm.value + (itm.unit || '')
      if (typeof value === 'object') {
        value = Object.keys(value)
          .map((key) => `${key}: ${value[key]}`)
          .join('; ')
      }
      const isRepeat = repeatArray.some((i: any) => JSON.stringify(i) === JSON.stringify(itm))
      if (isRepeat && itm.treeId) {
        const treeData = treeList.find((i: any) => i.id === itm.treeId)
        condition[`${itm.name}(${treeData?.value})`] = value
      } else {
        condition[itm.name] = value
      }
    })
    return { tag: item.tag, time: item.time, ...condition }
  })
}

// 字段清单 = 位号 + 读取时间 + HART 字典所有项(按当前语言取名)
const buildFieldList = () => {
  const fields: { label: string; key: string }[] = [
    { label: language.value === 'zh' ? '位号' : 'Tag', key: 'tag' },
    { label: language.value === 'zh' ? '读取时间' : 'Time', key: 'time' }
  ]
  const repeatArray = flattenDepth(
    Object.values(groupBy(dictData.value, (item: any) => item.name)).filter(
      (value) => value.length > 1
    ),
    1
  )
  dictData.value.forEach((item: any) => {
    const label =
      language.value === 'zh' ? item.cnTitle || item.name : item.enTitle || item.value
    const isRepeat = repeatArray.some((i: any) => JSON.stringify(i) === JSON.stringify(item))
    if (isRepeat && item.treeId) {
      fields.push({
        label: `${label}(${item.tree?.value})`,
        key: `${item.name}(${item.tree?.value})`
      })
    } else {
      fields.push({ label, key: item.name })
    }
  })
  return fields
}

// 转置后的列: 第一列固定"字段", 后续每列 = 一次采集
const buildTransposedColumns = (flat: any[]) => {
  const cols: any[] = [
    {
      title: language.value === 'zh' ? '字段' : 'Field',
      key: 'fieldName',
      width: 220,
      fixed: 'left'
    }
  ]
  flat.forEach((rec: any, idx: number) => {
    cols.push({
      title: () =>
        h('div', { class: 'text-center leading-tight' }, [
          h('div', null, rec.tag ?? ''),
          h(
            'div',
            { class: 'text-xs op-70' },
            rec.time ? dayjs(rec.time).format('YYYY-MM-DD HH:mm:ss') : ''
          )
        ]),
      key: `col_${idx}`,
      minWidth: 180
    })
  })
  return cols
}

// 转置后的行: 每行 = 一个字段, 值分布在 col_0..col_N
const buildTransposedRows = (flat: any[]) => {
  const fields = buildFieldList()
  return fields.map((f) => {
    const row: any = { fieldKey: f.key, fieldName: f.label }
    flat.forEach((rec: any, idx: number) => {
      let value = rec[f.key]
      if (f.key === 'time' && value) {
        value = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      }
      row[`col_${idx}`] = value ?? ''
    })
    return row
  })
}

const changeLanguage = () => {
  language.value = language.value === 'zh' ? 'en' : 'zh'
  reload()
}

// 导出 Excel 保持"横排"(每行=采集, 每列=字段) — 报告 xlsx 惯例, 便于二次分析
const exportData = async () => {
  const allRaw = await getValveHistoryList({
    valveId: Number(valveId.value),
    pageSize: 10000
  })
  const flat = transformData(allRaw.rows, dictDataTreeList.value)
  const tag = flat[0]?.tag
  if (!tag) {
    window.$message.error('暂无数据')
    return
  }
  const fields = buildFieldList()
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('解析结果')
  worksheet.columns = fields.map((f) => ({ header: f.label, key: f.key, width: 24 }))
  worksheet.addRows(
    flat.map((rec: any) => {
      const out: any = {}
      fields.forEach((f) => {
        let value = rec[f.key]
        if (f.key === 'time' && value) value = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
        out[f.key] = value ?? ''
      })
      return out
    })
  )
  const arraybuffer: any = new ArrayBuffer(10 * 1024 * 1024)
  const res = await workbook.xlsx.writeBuffer(arraybuffer)
  download(res, tag)
}

function download(arrayBuffer: any, tag: string) {
  const link = document.createElement('a')
  const blob = new Blob([arrayBuffer])
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = tag + ' - 阀门历史数据.xlsx'
  document.body.appendChild(link)
  link.click()
  link.addEventListener('click', () => link.remove())
}

watch(
  () => (router.currentRoute.value.params as { id: string }).id,
  async (val) => {
    if (!val || !Number(val)) return
    valveDetail.value = await getValveDetail(Number(val))
    const dictType = (await getDictTypeList({ name: 'HART', pageSize: 1000 })).rows
    const dictTypeId = dictType[0].id
    dictData.value = (await getDictDataList({ dictTypeId, pageSize: 1000 })).rows
    reload()
  },
  { immediate: true }
)
</script>

<template>
  <div class="h-full flex flex-col">
    <n-card class="mb-2 w-full" title="阀门信息" size="small">
      <n-grid :cols="3" x-gap="12">
        <n-gi>最终用户：{{ valveDetail.factory?.name }}</n-gi>
        <n-gi>装置：{{ valveDetail.unit }}</n-gi>
        <n-gi>位号：{{ valveDetail.tag }}</n-gi>
      </n-grid>
    </n-card>
    <Table class="w-full flex-1" @register="registerTable">
      <template #toolbar>
        <n-button class="mr-2" type="primary" @click="exportData()"> 导出数据 </n-button>
        <n-button class="mr-2" type="primary" @click="changeLanguage">
          {{ language === 'zh' ? '中文' : '英文' }}
        </n-button>
      </template>
    </Table>
  </div>
</template>

<style scoped></style>
