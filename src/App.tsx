import { useState } from 'react'
import type { WorkRow } from './types/workRow'
import * as XLSX from 'xlsx'

import { Step1Upload } from './sections/Step1Upload'
import { Step2ModeSelect } from './sections/Step2ModeSelect'
import { Step3OrderSelect } from './sections/Step3OrderSelect'
import { Step3InvoiceSelect } from './sections/Step3InvoiceSelect'
import { Step4Output } from './sections/Step4Output'


import { useTemplateSettings } from './hooks/useTemplateSettings'
import { styles } from './styles/appStyles'
import './App.css'

type Mode = 'order' | 'invoice'

function App() {
  const [rows, setRows] = useState<WorkRow[]>([])
  const [selectedName, setSelectedName] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedInvoiceMembers, setSelectedInvoiceMembers] = useState<string[]>([])
  const [mode, setMode] = useState<Mode>('order')

  const { settings, setSettings } = useTemplateSettings()

  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>('')

  const memberNames = Array.from(new Set(rows.map(r => r.要員名)))
  const selectedRow = rows.find(r => r.要員名 === selectedName)

  const billingClients = Array.from(new Set(rows.map(r => r.請求先名)))
  const invoiceMembers = rows.filter(r => r.請求先名 === selectedClient)
  const selectedInvoiceRows = rows.filter(r =>
    selectedInvoiceMembers.includes(r.要員名)
  )

  const allSelected =
    invoiceMembers.length > 0 &&
    invoiceMembers.every(r => selectedInvoiceMembers.includes(r.要員名))

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h4>📄 注文書発行システム</h4>
      </header>

      <div style={styles.container}>

        <Step1Upload
          rowsCount={rows.length}
          onLoadRows={setRows}
          onLoadWorkbook={(wb) => {
            setWorkbook(wb)
            setSheetNames(wb.SheetNames)
            setSelectedSheet(wb.SheetNames[0] ?? '')
          }}
        />

        <Step2ModeSelect
          mode={mode}
          setMode={setMode}
          onInvoiceSelect={() => {
            setSettings(prev => ({
              ...prev,
              documentType: 'invoice',
              title: '請求書',
            }))
          }}
        />

        {rows.length > 0 && mode === 'order' && (
          <Step3OrderSelect
            memberNames={memberNames}
            selectedName={selectedName}
            onChange={setSelectedName}
            workbook={workbook}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            setSelectedSheet={setSelectedSheet}
            setRows={setRows}
          />
        )}

        {rows.length > 0 && mode === 'invoice' && (
          <Step3InvoiceSelect
            rows={rows}
            workbook={workbook}
            sheetNames={sheetNames}
            selectedSheet={selectedSheet}
            setSelectedSheet={setSelectedSheet}
            setRows={setRows}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            billingClients={billingClients}
            invoiceMembers={invoiceMembers}
            selectedInvoiceMembers={selectedInvoiceMembers}
            setSelectedInvoiceMembers={setSelectedInvoiceMembers}
            allSelected={allSelected}
          />
        )}

        <Step4Output
          mode={mode}
          selectedRow={selectedRow}
          selectedInvoiceRows={selectedInvoiceRows}
          settings={settings}
          setSettings={setSettings}
        />

      </div>
    </div>
  )
}

export default App