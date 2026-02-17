// import { PDFDocument } from "pdf-lib"
// import fontkit from "@pdf-lib/fontkit"
// import type { WorkRow } from "../types/workRow"
// import type { TemplateSettingsType } from "../types/template"
// import { calcOrder } from "./calcOrder"

// export async function exportInvoicePdf(
//   row: WorkRow,
//   settings: TemplateSettingsType
// ) {
//   const res = await fetch("/templates/invoice.pdf")
//   const pdfDoc = await PDFDocument.load(await res.arrayBuffer())

//   pdfDoc.registerFontkit(fontkit)
//   const fontRes = await fetch("/fonts/NotoSansJP-Regular.ttf")
//   const font = await pdfDoc.embedFont(await fontRes.arrayBuffer())

//   const page = pdfDoc.getPages()[0]

//   page.drawText(row.顧客名 ?? "", { x: 80, y: 700, size: 12, font })

//   const items = [{ quantity: row.数量 ?? 0, unitPrice: row.単価 ?? 0 }]
//   const { total } = calcOrder(items)

//   page.drawText(total.toLocaleString(), { x: 400, y: 300, size: 12, font })

//   const bytes = await pdfDoc.save()
//   const blob = new Blob([bytes], { type: "application/pdf" })
//   const url = URL.createObjectURL(blob)
//   const a = document.createElement("a")
//   a.href = url
//   a.download = `請求書_${row.No}.pdf`
//   a.click()
//   URL.revokeObjectURL(url)
// }
