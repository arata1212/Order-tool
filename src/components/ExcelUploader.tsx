import * as XLSX from 'xlsx'
import type { WorkRow } from '../types/workRow'

type Props = {
  onLoad: (rows: WorkRow[]) => void
}

function ExcelUploader({ onLoad }: Props) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = evt.target?.result
      if (!data) return

      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const json = XLSX.utils.sheet_to_json<WorkRow>(sheet)
      console.log('稼働表データ', json)

      onLoad(json)
    }

    reader.readAsBinaryString(file)
  }

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFile} />
    </div>
  )
}

export default ExcelUploader
