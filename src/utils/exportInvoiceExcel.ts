import ExcelJS from 'exceljs'
import type { WorkRow } from '../types/workRow'
import { calcInvoice } from './calcInvoice'
import type { TemplateSettingsType } from '../types/template'

export async function exportInvoiceExcel(
  row: WorkRow,
  settings: TemplateSettingsType
) {
  // ① テンプレ読み込み
  const res = await fetch('/請求書テンプレ 1.xlsx')
  const arrayBuffer = await res.arrayBuffer()

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(arrayBuffer)

  const sheet = workbook.worksheets[0]

  // --- 値だけセット（スタイルは触らない） ---
  const setCell = (addr: string, value: any) => {
    sheet.getCell(addr).value = value ?? ''
  }

  sheet.getCell('B31').alignment = {
  horizontal: 'left',
  }

  //テンプレート設定
  sheet.getCell("B2").value = settings.title
  sheet.getCell("I7").value = settings.companyName
  sheet.getCell("I8").value = settings.postCode
  ? `〒${settings.postCode}`
  : ''
  sheet.getCell("I9").value = settings.address
  sheet.getCell("I10").value = settings.building
  sheet.getCell("I11").value = settings.tel
  ? `TEL：${settings.tel}`
  : ''
  sheet.getCell("I12").value = settings.inchage
  ? `担当：${settings.inchage}`
  : ''


  // ② 基本情報
  setCell('B4', row.請求先名 ? `${row.請求先名}　御中` : "")
  setCell('J4', row.No)

  setCell('C9', row.作業期間)
  setCell('C10', row.支払日)
  setCell('C11', row.納期)
  setCell('C12', row.振込先)

  setCell('B18', row.要員名)
  setCell('D18', row.単価)
  setCell('E18', String(row.数量))
  // setCell('F18', row.価格)
  setCell('G18', row.基準時間)
  setCell('H18', row.実働時間)
  setCell('I18', row.超過時間)
  setCell('J18', row.控除時間)
  setCell('K18', row.諸経費)

  setCell('K27', row.立替金)

  setCell('B31', row.特記事項)

  // 日付
  const dateCell = sheet.getCell('J5')

  if (row.請求日) {
    const rawDate = String(row.請求日)

    if (rawDate.length === 8) {
      const year = Number(rawDate.slice(0, 4))
      const month = Number(rawDate.slice(4, 6)) - 1
      const day = Number(rawDate.slice(6, 8))

      dateCell.value = new Date(Date.UTC(year, month, day))
      dateCell.numFmt = 'yyyy/mm/dd'
    }
  }

  dateCell.alignment = {
    horizontal: 'left',
  }

  // ③ 計算
  const {
  lineTotal,
  subtotalPrice,
  subtotalExpense,
  tax,
  total
} = calcInvoice(
  row.数量,
  row.単価,      // 単価
  row.諸経費     // ← WorkRowにあるなら
)

// 明細
setCell('F18', lineTotal)

// 小計
setCell('F28', subtotalPrice)
setCell('K28', subtotalExpense)

// 税・合計
setCell('K29', tax)
setCell('K30', total)


  // ⑤ 出力
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `請求書_${row.No}.xlsx`
  a.click()

  URL.revokeObjectURL(url)
}
