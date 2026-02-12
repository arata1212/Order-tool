// 明細1行分
export type OrderItem = {
  quantity?: number   // D列（数量）
  unitPrice?: number  // F列（単価）
}

// 計算結果
export type OrderCalcResult = {
  lineTotals: (number | null)[] // G列（明細金額）
  subtotal: number              // G22
  tax: number                   // G23
  total: number                 // G24
}

export function calcOrder(items: OrderItem[]): OrderCalcResult {
  // 明細金額（=IF(AND(D<>"",F<>""),D*F,"")）
  const lineTotals = items.map(item => {
    if (
      item.quantity !== undefined &&
      item.unitPrice !== undefined
    ) {
      return item.quantity * item.unitPrice
    }
    return null
  })

  // 小計（=SUM(G15:G21)）
  const subtotal = lineTotals.reduce<number>((sum, v) => {
    return v !== null ? sum + v : sum
  }, 0)

  // 消費税（=G22*0.1）
  const tax = subtotal * 0.1

  // 合計（=G22+G23）
  const total = subtotal + tax

  return {
    lineTotals,
    subtotal,
    tax,
    total,
  }
}
