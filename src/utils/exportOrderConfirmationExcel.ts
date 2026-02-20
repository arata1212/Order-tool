import ExcelJS from 'exceljs'
import type { WorkRow } from '../types/workRow'
import { calcOrder } from './calcOrder'
import type { TemplateSettingsType } from '../types/template'

export async function exportOrderConfirmationExcel(
  row: WorkRow,
  settings: TemplateSettingsType
) {
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

  //テンプレート設定
  sheet.getCell("A1").value = settings.title

  // ② 基本情報
  setCell('F6', row.顧客名)
  setCell('F7', row.顧客先代表取締役名)
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

  // 日付
  const dateCell = sheet.getCell('G3')

  if (row.日付) {
    const rawDate = String(row.日付)

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
  const items = [
    {
      quantity: row.数量,
      unitPrice: row.単価,
    },
  ]

  const { lineTotals, subtotal, tax, total } = calcOrder(items)

  // ④ 数値
  setCell('D15', row.数量)
  setCell('F15', row.単価)
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
