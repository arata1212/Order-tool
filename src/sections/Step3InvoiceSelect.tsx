import Section from '../layout/Section'
import * as XLSX from 'xlsx'
import { styles } from '../styles/appStyles'
import type { WorkRow } from '../types/workRow'
import SheetSelector from '../components/SheetSelector'

type Props = {
  rows: WorkRow[]
  workbook: XLSX.WorkBook | null
  sheetNames: string[]
  selectedSheet: string
  setSelectedSheet: (v: string) => void
  setRows: (rows: WorkRow[]) => void
  selectedClient: string
  setSelectedClient: (v: string) => void
  billingClients: string[]
  invoiceMembers: WorkRow[]
  selectedInvoiceMembers: string[]
  setSelectedInvoiceMembers: React.Dispatch<React.SetStateAction<string[]>>
  allSelected: boolean
}

export const Step3InvoiceSelect = ({
  rows,
  workbook,
  sheetNames,
  selectedSheet,
  setSelectedSheet,
  setRows,
  selectedClient,
  setSelectedClient,
  billingClients,
  invoiceMembers,
  selectedInvoiceMembers,
  setSelectedInvoiceMembers,
  allSelected,
}: Props) => {
  return (
    <Section title="STEP 3｜請求先・要員選択（請求書）">

      <SheetSelector
        workbook={workbook}
        sheetNames={sheetNames}
        selectedSheet={selectedSheet}
        setSelectedSheet={setSelectedSheet}
        setRows={setRows}
      />

      <select
        style={styles.select}
        value={selectedClient}
        onChange={(e) => {
          const client = e.target.value
          setSelectedClient(client)

          const members = rows
            .filter(row => row.請求先名 === client)
            .map(row => row.要員名)

          setSelectedInvoiceMembers(members)
        }}
      >
        <option value="">請求先を選択</option>
        {billingClients.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      {selectedClient && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              type="button"
              disabled={allSelected}
              onClick={() => {
                const members = invoiceMembers.map(row => row.要員名)
                setSelectedInvoiceMembers(members)
              }}
            >
              全選択
            </button>

            <button
              type="button"
              onClick={() => setSelectedInvoiceMembers([])}
            >
              全解除
            </button>
          </div>

          {invoiceMembers.map(row => (
            <label key={row.要員名} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={selectedInvoiceMembers.includes(row.要員名)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedInvoiceMembers(prev => [...prev, row.要員名])
                  } else {
                    setSelectedInvoiceMembers(prev =>
                      prev.filter(name => name !== row.要員名)
                    )
                  }
                }}
              />
              {row.要員名}
            </label>
          ))}
        </div>
      )}
    </Section>
  )
}