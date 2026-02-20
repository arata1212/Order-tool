// src/utils/calcInvoice.ts
export type InvoiceCalcResult = {
  lineTotal: number | null       // 単価×数量
  subtotalPrice: number          // 価格小計
  subtotalExpense: number        // 諸経費小計
  tax: number                    // 消費税（切り捨て）
  total: number                  // 合計（税込）
}

export function calcInvoice(
  quantity?: number,
  unitPrice?: number,
  expense?: number
): InvoiceCalcResult {

  // ① 単価×数量
  const lineTotal =
    typeof quantity === 'number' &&
    typeof unitPrice === 'number'
      ? quantity * unitPrice
      : null

  // ② 価格小計
  const subtotalPrice = lineTotal ?? 0

  // ③ 諸経費小計
  const subtotalExpense =
    typeof expense === 'number' ? expense : 0

  // ④ 消費税（切り捨て）
  const tax = Math.floor(
    (subtotalPrice + subtotalExpense) * 0.1
  )

  // ⑤ 合計（税込）
  const total = subtotalPrice + subtotalExpense + tax

  return {
    lineTotal,
    subtotalPrice,
    subtotalExpense,
    tax,
    total,
  }
}