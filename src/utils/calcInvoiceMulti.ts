// src/utils/calcInvoiceMulti.ts
import type { WorkRow } from '../types/workRow'
import { calcInvoice } from './calcInvoice.ts'

export function calcInvoiceMulti(rows: WorkRow[]) {
  const details = rows.slice(0, 8).map(row => {
    const result = calcInvoice(row.数量, row.単価, row.諸経費)
    return {
      row,
      lineTotal: result.lineTotal,
      subtotalPrice: result.subtotalPrice,
      subtotalExpense: result.subtotalExpense,
    }
  })

  const subtotalPrice = details.reduce(
    (sum, d) => sum + d.subtotalPrice,
    0
  )

  const subtotalExpense = details.reduce(
    (sum, d) => sum + d.subtotalExpense,
    0
  )

  // ✅ 立替金は「先頭行のみ」採用
  const advance = rows[0]?.立替金 ?? 0

  const tax = Math.floor((subtotalPrice + subtotalExpense) * 0.1)

  const total = subtotalPrice + subtotalExpense + tax + advance

  return {
    details,
    subtotalPrice,
    subtotalExpense,
    advance,
    tax,
    total,
  }
}