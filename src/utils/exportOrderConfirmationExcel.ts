import ExcelJS from 'exceljs'
import type { WorkRow } from '../types/workRow'
import { calcOrder } from './calcOrder'

export async function exportOrderConfirmationExcel(row: WorkRow) {
  // ① テンプレ読み込み
  const res = await fetch('/【アレンジ版】発注請書_タテ型_空欄版.xlsx')
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

  // ② 基本情報
  setCell('F6', row.顧客名)
  setCell('F7', row.顧客先代表取締役名)
  const dateCell = sheet.getCell('G3')
  dateCell.value = new Date(row.日付)
  dateCell.numFmt = 'yyyy/mm/dd'
  dateCell.alignment = {
  ...dateCell.alignment,
  horizontal: 'left',
  }
  setCell('G2', row.No)

  setCell('B6', row.案件名)
  setCell('B7', row.作業期間)
  setCell('A15', row.要員名)

  setCell('E15', row.単位)

  setCell('B28', row.勤務条件)
  setCell('B29', row.勤務時間)

  setCell('B30', row.清算幅)
  setCell('B31', row.清算単価)
  setCell('B32', row.清算単位)

  setCell('B9', row.支払いサイト)
  setCell('A35', row.支払い)
  setCell('A38', row.その他)

  // ③ 計算
  const items = [
    {
      quantity: row.数量,
      unitPrice: row.金額,
    },
  ]

  const { lineTotals, subtotal, tax, total } = calcOrder(items)

  // ④ 数値
  setCell('D15', row.数量)
  setCell('F15', row.金額)
  setCell('G15', lineTotals[0])

  setCell('G22', subtotal)
  setCell('G23', tax)
  setCell('G24', total)
  setCell('B11', total)

  // ⑤ 出力
  const buffer = await workbook.xlsx.writeBuffer()

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `注文請書_${row.No}.xlsx`
  a.click()

  URL.revokeObjectURL(url)
}
