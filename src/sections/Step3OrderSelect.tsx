import Section from '../layout/Section'
import { styles } from '../styles/appStyles'
import SheetSelector from '../components/SheetSelector'
import * as XLSX from 'xlsx'
import type { WorkRow } from '../types/workRow'

type Props = {
  memberNames: string[]
  selectedName: string
  onChange: (name: string) => void
  // 👇 SheetSelector 用
  workbook: XLSX.WorkBook | null
  sheetNames: string[]
  selectedSheet: string
  setSelectedSheet: (name: string) => void
  setRows: (rows: WorkRow[]) => void
}

export const Step3OrderSelect = ({
  memberNames,
  selectedName,
  onChange,
  workbook,
  sheetNames,
  selectedSheet,
  setSelectedSheet,
  setRows,
}: Props) => {
  return (
    <Section title="STEP 3｜要員選択（注文書・注文請書）">

      <SheetSelector
        workbook={workbook}
        sheetNames={sheetNames}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
        setRows={setRows}
      />

      <select
        style={styles.select}
        value={selectedName}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">選択してください</option>
        {memberNames.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </Section>
  )
}