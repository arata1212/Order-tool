// import ExcelJS from "exceljs"
// import type { WorkRow } from "../types/workRow"
// import type { TemplateSettingsType } from "../types/template"
// import { calcOrder } from "./calcOrder"

// export async function exportInvoiceExcel(
//   row: WorkRow,
//   settings: TemplateSettingsType
// ) {
//   const res = await fetch('/請求書テンプレ 1.xlsx')
//   const buffer = await res.arrayBuffer()

//   const workbook = new ExcelJS.Workbook()
//   await workbook.xlsx.load(buffer)

//   const sheet = workbook.worksheets[0]

//   // ここに請求書テンプレのセル割り当てを書く
//   sheet.getCell("A1").value = settings.companyName
//   sheet.getCell("B5").value = row.顧客名

//   const items = [{ quantity: row.数量 ?? 0, unitPrice: row.単価 ?? 0 }]
//   const { subtotal, tax, total } = calcOrder(items)

//   sheet.getCell("G20").value = total

//   const out = await workbook.xlsx.writeBuffer()
//   const blob = new Blob([out], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   })

//   const url = URL.createObjectURL(blob)
//   const a = document.createElement("a")
//   a.href = url
//   a.download = `請求書_${row.No}.xlsx`
//   a.click()
//   URL.revokeObjectURL(url)
// }
