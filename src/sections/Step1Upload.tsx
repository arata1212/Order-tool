import ExcelUploader from '../components/ExcelUploader'
import * as XLSX from 'xlsx'
import Section from '../layout/Section'

type Props = {
  rowsCount: number
  onLoadRows: (rows: any[]) => void
  onLoadWorkbook: (wb: XLSX.WorkBook) => void
}

export const Step1Upload = ({ rowsCount, onLoadRows, onLoadWorkbook }: Props) => {
  return (
    <Section title="STEP 1｜稼働表アップロード">
      <ExcelUploader
        onLoad={onLoadRows}
        onLoadWorkbook={onLoadWorkbook}
      />
      <p>読み込み件数：{rowsCount}</p>
    </Section>
  )
}