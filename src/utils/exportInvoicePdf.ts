import { PDFDocument, type PDFPage, } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import type { WorkRow } from '../types/workRow'
import type { TemplateSettingsType } from "../types/template"
import { calcInvoice } from './calcInvoice'


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
   PDF出力本体
========================= */
export async function exportInvoicePdf(
  row: WorkRow,
  settings: TemplateSettingsType) {
  try {
    console.log('PDF出力 row:', row)

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


    /* ---------- テンプレート設定 ---------- */
    drawSpacedTextJP(page, settings.title, 291, 763, 16, japaneseFont, 17)
    drawTextJP(page, settings.companyName, 409, 704, 8, japaneseFont)
    drawTextJP(page, settings.postCode, 418, 693, 8, japaneseFont)
    drawTextJP(page, settings.address, 409, 683, 8, japaneseFont)
    drawTextJP(page, settings.building, 409, 672, 8, japaneseFont)
    drawTextJP(page, settings.tel, 429, 661.5, 8, japaneseFont)
    drawTextJP(page, settings.inchage, 432, 650.5, 8, japaneseFont)
    /* ---------- 計算 ---------- */
    const {
      lineTotal,
      subtotalPrice,
      subtotalExpense,
      tax,
      total,
    } = calcInvoice(
      row.数量,
      row.単価,
      row.諸経費
    )
    /* ---------- PDF項目定義 ---------- */
    const pdfFields = [
      // 基本情報
      { value: row.請求先名 ? `${row.請求先名}　御中` : "", x: 40, y: 730, size: 16 },
      { value: formatDate(row.請求日), x: 446, y: 729, size: 8 },
      { value: row.No, x: 446, y: 739.5, size: 8 },

      { value: row.作業期間, x: 96, y: 682, size: 8 },
      { value: row.支払日, x: 96, y: 671.5, size: 8 },
      { value: row.納期, x: 96, y: 661, size: 8 },
      { value: row.振込先, x: 96, y: 651, size: 8 },

      // 請求書明細
      { value: row.要員名, x: 82, y: 571, size: 9 },
      { value: row.単価, x: 175, y: 571, size: 9 },
      { value: row.数量, x: 228, y: 571, size: 9 },
      // { value: row.価格, x: 250, y: 571, size: 9 },
      // { value: row.基準時間, x: 300, y: 571, size: 9 },
      { value: row.実働時間, x: 370, y: 571, size: 9 },
      { value: row.超過時間, x: 424, y: 571, size: 9 },
      { value: row.控除時間, x: 465, y: 571, size: 9 },
      // { value: row.諸経費, x: 520, y: 571, size: 9 },
      // { value: row.立替金, x: 520, y: 383, size: 9 },

      // その他
      { value: row.特記事項, x: 45, y: 325, size: 9 },
    ]
    drawRightAlignedTextJP(page, String(row.諸経費), 550, 571, 9, japaneseFont)
    drawRightAlignedTextJP(page, String(row.立替金), 550, 383, 9, japaneseFont)

    drawMixedTextJP(
      page,
      row.基準時間,
      300,
      571,
      9,
      japaneseFont,
      monoFont
    )

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
    if (lineTotal !== null) {
      drawRightAlignedTextJP(page, lineTotal.toLocaleString(), 290, 571, 9, japaneseFont)
    }

    /* ---------- 小計 ---------- */
    drawRightAlignedTextJP(page, subtotalPrice.toLocaleString(), 290, 370, 9, japaneseFont)
    drawRightAlignedTextJP(page, subtotalExpense.toLocaleString(), 550, 369, 9, japaneseFont)
    

    /* ---------- 税・合計 ---------- */
    drawRightAlignedTextJP(page, tax.toLocaleString(), 550, 356, 9, japaneseFont)

    const advance = row.立替金 ?? 0
    const grandTotal = total + advance
    drawRightAlignedTextJP(page, grandTotal.toLocaleString(), 550, 342, 10, japaneseFont)


    /* ---------- 出力 ---------- */
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `請求書_${row.No ?? ''}.pdf`
    a.click()

    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('PDF出力エラー:', e)
    alert('PDF出力に失敗しました（consoleを確認してください）')
  }
}