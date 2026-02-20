import ExcelJS from 'exceljs'
import type { WorkRow } from '../types/workRow'
import type { TemplateSettingsType } from '../types/template'
import { calcInvoiceMulti } from './calcInvoiceMulti'

export async function exportInvoiceExcel(
  rows: WorkRow[],
  settings: TemplateSettingsType
) {
  if (rows.length === 0) {
    alert('請求対象の要員がありません')
    return
  }

  const firstRow = rows[0]  // ← 共通項目はここから取る

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

  // 日付
  const dateCell = sheet.getCell('J5')

  if (firstRow.請求日) {
    const rawDate = String(firstRow.請求日)

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

  //テンプレート設定
  setCell('B2', settings.title)
  setCell('I7', settings.companyName)
  setCell('I8', settings.postCode ? `〒${settings.postCode}` : '')
  setCell('I9', settings.address)
  setCell('I10', settings.building)
  setCell('I11', settings.tel ? `TEL：${settings.tel}` : '')
  setCell('I12', settings.inchage ? `担当：${settings.inchage}` : '')
  
  // ② 基本情報
  setCell('B4', firstRow.請求先名 ? `${firstRow.請求先名}　御中` : "")
  setCell('J4', firstRow.No)

  setCell('C9', firstRow.作業期間)
  setCell('C10', firstRow.支払日)
  setCell('C11', firstRow.納期)
  setCell('C12', firstRow.振込先)
  
  setCell('G18', firstRow.基準時間)
  setCell('H18', firstRow.実働時間)
  setCell('I18', firstRow.超過時間)
  setCell('J18', firstRow.控除時間)
  setCell('K18', firstRow.諸経費)

  setCell('B31', firstRow.特記事項)

  

  // ③ 計算
  const startRow = 18

  const {
    details,
    subtotalPrice,
    subtotalExpense,
    advance,
    tax,
    total
  } = calcInvoiceMulti(rows)

  details.forEach((d, i) => {
    const r = startRow + i

    setCell(`B${r}`, d.row.要員名)
    setCell(`D${r}`, d.row.単価)
    setCell(`E${r}`, d.row.数量)
    setCell(`F${r}`, d.lineTotal)// 単価×数量
    setCell(`K${r}`, d.row.諸経費)
  })


/* ---------- 計算結果反映 ---------- */
  setCell('F28', subtotalPrice)     // 価格小計
  setCell('K28', subtotalExpense)   // 諸経費小計
  setCell('K29', tax)               // 消費税
  setCell('K27', advance)   // 立替金
  setCell('K30', total)             // 合計（税込）

  // ⑤ 出力
  const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `請求書_${firstRow.No ?? ''}.xlsx`
  a.click()

  if (rows.slice(1).some(r => r.立替金)) {
  console.warn('立替金は1行目のみ有効です')
  }

  URL.revokeObjectURL(url)
}