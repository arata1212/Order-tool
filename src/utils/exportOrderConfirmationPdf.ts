import { PDFDocument, type PDFPage, } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { WorkRow } from '../types/workRow'
import { calcOrder } from './calcOrder'

/* =========================
   座標ガイド（開発用）
========================= */
// function drawGuide(page: PDFPage) {
//   for (let x = 0; x <= 600; x += 50) {
//     page.drawText(String(x), { x, y: 5, size: 6 })
//   }
//   for (let y = 0; y <= 850; y += 50) {
//     page.drawText(String(y), { x: 5, y, size: 6 })
//   }
// }


/* =========================
   日本語安全 drawText
========================= */
function drawTextJP( 
  page: PDFPage, 
  value: unknown, 
  x: number, 
  y: number, 
  size: number, 
  font: any ) { 
    const text = 
    value === null || value === undefined ? '' : 
    String(value) 
    
    page.drawText(text, { x, y, size, font, }) }

/* =========================
   日付
========================= */
function formatDate(dateInput: string | number | Date | undefined | null) {
  if (!dateInput) return ''

  // ① YYYYMMDD形式（例: 20260209）の場合
  const raw = String(dateInput)

  if (/^\d{8}$/.test(raw)) {
    const yyyy = raw.slice(0, 4)
    const mm = raw.slice(4, 6)
    const dd = raw.slice(6, 8)
    return `${yyyy}/${mm}/${dd}`
  }

  // ② 通常のDate or 文字列の場合
  const date = new Date(dateInput)

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  return `${yyyy}/${mm}/${dd}`
}


/* =========================
   右揃え
========================= */
function drawRightAlignedTextJP(
  page: any,
  text: string,
  rightX: number,
  y: number,
  size: number,
  font: any
) {
  const textWidth = font.widthOfTextAtSize(text, size)

  page.drawText(text, {
    x: rightX - textWidth,
    y,
    size,
    font,
  })
}


/* =========================
   PDF出力本体
========================= */
export async function exportOrderConfirmationPdf(row: WorkRow) {
  try {
    console.log('PDF出力 row:', row)

    /* ---------- PDFテンプレ ---------- */
    const res = await fetch('/【アレンジ版】発注請書_タテ型_空欄版.pdf')
    if (!res.ok) throw new Error('PDFテンプレ取得失敗')

    const pdfDoc = await PDFDocument.load(await res.arrayBuffer())

    /* ---------- 日本語フォント ---------- */
    pdfDoc.registerFontkit(fontkit)

    const fontRes = await fetch('/NotoSansJP-Regular.ttf')
    if (!fontRes.ok) throw new Error('フォント取得失敗')

    const japaneseFont = await pdfDoc.embedFont(
      await fontRes.arrayBuffer()
    )

    const page = pdfDoc.getPages()[0]

    // ★ 座標確認したいときだけON
    // drawGuide(page)

    
    /* ---------- 計算 ---------- */
    const items = [
      {
        quantity: row.数量 ?? 0,
        unitPrice: row.単価 ?? 0,
      },
    ]

    const { lineTotals, subtotal, tax, total } = calcOrder(items)

    /* ---------- PDF項目定義 ---------- */
    const pdfFields = [
      // 基本情報
      { value: row.顧客名, x: 400, y: 661, size: 10 },
      { value: row.顧客先代表取締役名, x: 400, y: 643, size: 10 },
      { value: formatDate(row.日付), x: 452, y: 716, size: 10 },
      { value: row.No, x: 452, y: 734, size: 10 },

      { value: row.案件名, x: 121, y: 661, size: 10 },
      { value: row.作業期間, x: 121, y: 643, size: 10 },
      { value: row.要員名, x: 140, y: 498, size: 12 },

      // 勤務条件系
      { value: row.単位, x: 355, y: 498, size: 10 },
      { value: row.勤務条件, x: 125, y: 262, size: 10 },
      { value: row.勤務時間, x: 125, y: 245, size: 10 },

      // 清算条件
      { value: row.清算幅, x: 125, y: 226, size: 10 },
      { value: row.清算単価, x: 125, y: 208, size: 10 },
      { value: row.清算単位, x: 125, y: 190, size: 10 },

      // 支払い条件
      { value: row.支払いサイト, x: 121, y: 607, size: 10 },
      { value: row.支払い, x: 51, y: 140, size: 10 },

      // その他
      { value: row.その他, x: 51, y: 87, size: 10 },
    ]

    /* ---------- 一括描画 ---------- */
    pdfFields.forEach((f) => {
      drawTextJP(
        page,
        f.value,
        f.x,
        f.y,
        f.size ?? 10,
        japaneseFont
      )
    })
    // 座標描画
  //   if (import.meta.env.DEV) {
  // drawGuide(page)
  // }

    /* ---------- 明細 ---------- */
    drawTextJP(page, row.数量, 308, 498, 10, japaneseFont)
    drawTextJP(page, row.単価, 400, 498, 10, japaneseFont)

    if (lineTotals[0] != null) {
      drawRightAlignedTextJP( 
        page, 
        lineTotals[0].toLocaleString(), 
        540, 
        498, 
        10, 
        japaneseFont 
      )
    }

    /* ---------- 合計 ---------- */
    drawRightAlignedTextJP(page, subtotal.toLocaleString(), 540, 372, 10, japaneseFont)
    drawRightAlignedTextJP(page, tax.toLocaleString(), 540, 353, 10, japaneseFont)
    drawRightAlignedTextJP(page, total.toLocaleString(), 540, 335, 10, japaneseFont)

    drawRightAlignedTextJP(
      page,
      `${total.toLocaleString()}円(税込)`,
      330,
      559,
      18,
      japaneseFont
    )


    /* ---------- 出力 ---------- */
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `注文請書_${row.No ?? ''}.pdf`
    a.click()

    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('PDF出力エラー:', e)
    alert('PDF出力に失敗しました（consoleを確認してください）')
  }
}


