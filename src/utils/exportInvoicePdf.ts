import { PDFDocument, type PDFPage, } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { WorkRow } from '../types/workRow'
import type { TemplateSettingsType } from "../types/template"
import { calcInvoiceMulti } from './calcInvoiceMulti'


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

// 座標描画
  //   if (import.meta.env.DEV) {
  // drawGuide(page)
  // }
/* =========================
   日本語安全 drawText(デフォルトテキスト)
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
   右揃え(数値用)
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
   字間付き描画関数(タイトル用)
========================= */
function drawSpacedTextJP(
  page: PDFPage,
  text: string,
  centerX: number,
  y: number,
  size: number,
  font: any,
  letterSpacing: number
) {
  let totalWidth = 0

  for (const char of text) {
    totalWidth += font.widthOfTextAtSize(char, size) + letterSpacing
  }

  totalWidth -= letterSpacing

  let x = centerX - totalWidth / 2

  for (const char of text) {
    page.drawText(char, { x, y, size, font })
    x += font.widthOfTextAtSize(char, size) + letterSpacing
  }
}


 /* =========================
   英数字用フォント
========================= */

function drawMixedTextJP(
  page: PDFPage,
  text: string | number | null | undefined,
  x: number,
  y: number,
  size: number,
  jpFont: any,
  monoFont: any
) {
  if (!text) return

  let cursorX = x

  for (const char of String(text)) {
    const font = /[0-9h\-]/.test(char) ? monoFont : jpFont
    const w = font.widthOfTextAtSize(char, size)

    page.drawText(char, { x: cursorX, y, size, font })
    cursorX += w
  }
}

/* =========================
   PDF出力本体
========================= */
export async function exportInvoicePdf(
  rows: WorkRow[],
  settings: TemplateSettingsType) {
    const header = rows[0]
  try {
    console.log('PDF出力 rows:', rows)

    /* ---------- PDFテンプレ ---------- */
    const res = await fetch('/請求書空欄 1.pdf')
    if (!res.ok) throw new Error('PDFテンプレ取得失敗')

    const pdfDoc = await PDFDocument.load(await res.arrayBuffer())

    /* ---------- 日本語フォントand英数字フォント ---------- */
    pdfDoc.registerFontkit(fontkit)

    const fontRes = await fetch('/NotoSansJP-Regular.ttf')
    const japaneseFont = await pdfDoc.embedFont(await fontRes.arrayBuffer())

    const monoFontRes = await fetch('/RobotoMono-Regular.ttf')
    const monoFont = await pdfDoc.embedFont(await monoFontRes.arrayBuffer())

    const page = pdfDoc.getPages()[0]

    // ★ 座標確認したいときだけON
    // drawGuide(page)



    /* ---------- テンプレート設定 ---------- */
    drawSpacedTextJP(page, settings.title, 291, 763, 16, japaneseFont, 17)
    drawTextJP(page, settings.companyName, 409, 704, 8, japaneseFont)
    drawTextJP(page, settings.postCode, 418, 693, 8, japaneseFont)
    drawTextJP(page, settings.address, 409, 683, 8, japaneseFont)
    drawTextJP(page, settings.building, 409, 672, 8, japaneseFont)
    drawTextJP(page, settings.tel, 429, 661.5, 8, japaneseFont)
    drawTextJP(page, settings.inchage, 432, 650.5, 8, japaneseFont)
    
    /* ---------- PDF項目定義 ---------- */
      // 基本情報
      drawTextJP(page, header.請求先名 ? `${header.請求先名}　御中` : "", 40, 730, 16, japaneseFont)
      drawTextJP(page, formatDate(header.請求日), 446, 729, 8, japaneseFont)
      drawTextJP(page, header.No, 446, 739.5, 8, japaneseFont)

      drawTextJP(page, header.作業期間, 96, 682, 8, japaneseFont)
      drawTextJP(page, header.支払日, 96, 671.5, 8, japaneseFont)
      drawTextJP(page, header.納期, 96, 661, 8, japaneseFont)
      drawTextJP(page, header.振込先, 96, 651, 8, japaneseFont)

    /* ---------- 明細 + 集計 ---------- */
    const {
    details,
    subtotalPrice,
    subtotalExpense,
    advance,
    tax,
    total
  } = calcInvoiceMulti(rows)

    const startY = 571
    const rowGap = 22

    details.forEach(({ row, lineTotal }, i) => {
      const y = startY - i * rowGap
      
    drawTextJP(page, row.要員名, 82, y, 9, japaneseFont)
    drawRightAlignedTextJP(page, String(row.単価 ?? ''), 206, y, 9, japaneseFont)
    drawRightAlignedTextJP(page, String(row.数量 ?? ''), 233, y, 9, japaneseFont)

    drawMixedTextJP(page, row.基準時間, 300, y, 9, japaneseFont, monoFont)
    drawRightAlignedTextJP(page, String(row.実働時間 ?? ''), 385, y, 9, japaneseFont)
    drawRightAlignedTextJP(page, String(row.超過時間 ?? ''), 429, y, 9, japaneseFont)
    drawRightAlignedTextJP(page, String(row.控除時間 ?? ''), 470, y, 9, japaneseFont)

    drawRightAlignedTextJP(page, String(row.諸経費 ?? ''), 550, y, 9, japaneseFont)

    // 立替金（非課税）
    drawRightAlignedTextJP(page, advance.toLocaleString(), 550, 383, 9, japaneseFont)


      if (lineTotal !== null) {
        drawRightAlignedTextJP(page, lineTotal.toLocaleString(), 290, y, 9, japaneseFont)
      }
    })

    drawRightAlignedTextJP(page, subtotalPrice.toLocaleString(), 290, 370, 9, japaneseFont)
    drawRightAlignedTextJP(page, subtotalExpense.toLocaleString(), 550, 369, 9, japaneseFont)
    drawRightAlignedTextJP(page, tax.toLocaleString(), 550, 356, 9, japaneseFont)
    drawRightAlignedTextJP(page, total.toLocaleString(), 550, 342, 10, japaneseFont)

    drawTextJP(page, header.特記事項, 45, 325, 9, japaneseFont)


    /* ---------- 出力 ---------- */
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `請求書_${header.No ?? ''}.pdf`
    a.click()

    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('PDF出力エラー:', e)
    alert('PDF出力に失敗しました（consoleを確認してください）')
  }
  if (rows.slice(1).some(r => r.立替金)) {
  console.warn('立替金は1行目のみ有効です')
  }
}