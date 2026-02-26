import * as XLSX from 'xlsx'

type Props = {
  workbook: XLSX.WorkBook | null
  sheetNames: string[]
  selectedSheet: string
  setSelectedSheet: (name: string) => void
  setRows: (rows: any[]) => void
}

export default function SheetSelector({
  workbook,
  sheetNames,
  selectedSheet,
  setSelectedSheet,
  setRows,
}: Props) {
  if (!workbook || sheetNames.length === 0) return null

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontWeight: 'bold' }}>📄 参照するシート：</label>
      <select
        value={selectedSheet}
        onChange={(e) => {
          const name = e.target.value
          setSelectedSheet(name)

          const sheet = workbook.Sheets[name]
          const json = XLSX.utils.sheet_to_json(sheet)
          setRows(json as any[])
        }}
      >
        {sheetNames.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}