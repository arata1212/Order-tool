import { useState } from 'react'
import ExcelUploader from './components/ExcelUploader'
import type { WorkRow } from './types/workRow'
import { exportOrderExcel } from './utils/exportOrderExcel'
import { exportOrderPdf } from './utils/exportOrderPdf'
import { exportOrderConfirmationExcel } from './utils/exportOrderConfirmationExcel'
import { exportOrderConfirmationPdf } from './utils/exportOrderConfirmationPdf'
import { exportInvoiceExcel } from './utils/exportInvoiceExcel'
import { exportInvoicePdf } from './utils/exportInvoicePdf'
import Section from './layout/Section'
import OutputCard from './layout/OutputCard'
import { styles } from './styles/appStyles'
import './App.css'
import { TemplateSettings } from './components/template/TemplateSettings'
import { useTemplateSettings } from './hooks/useTemplateSettings'
import * as XLSX from 'xlsx'

function App() {
  const [rows, setRows] = useState<WorkRow[]>([])
  const [selectedName, setSelectedName] = useState('')
  // 請求書用
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedInvoiceMembers, setSelectedInvoiceMembers] = useState<string[]>([])

  const { settings, setSettings } = useTemplateSettings()

  // 要員名一覧
  const memberNames = Array.from(
    new Set(rows.map(row => row.要員名))
  )

  // 選択された要員の一行
  const selectedRowLog = rows.find(row => row.要員名 === selectedName)

  if (selectedRowLog) {
    console.log('選択された行', selectedRowLog)
  }

  const billingClients = Array.from(new Set(rows.map(row => row.請求先名)))
  const invoiceMembers = rows.filter(row => row.請求先名 === selectedClient)
  type Mode = 'order' | 'invoice'
  const [mode, setMode] = useState<Mode>('order')

  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>('')

  //出力部分
  const selectedRow = rows.find(row => row.要員名 === selectedName)
  const selectedInvoiceRows = rows.filter(row =>
    selectedInvoiceMembers.includes(row.要員名)
  )
  // すでに全員選択中なら「全選択」を無効化(請求書Step3)
  const allSelected =
  invoiceMembers.length > 0 &&
  invoiceMembers.every(row =>
    selectedInvoiceMembers.includes(row.要員名)
  )

  return (
    <div style={styles.page}>
    <header style={styles.header}>
      <h4>📄 注文書発行システム</h4>
    </header>

    <div style={styles.container}>

      <Section title="STEP 1｜稼働表アップロード">
        <ExcelUploader
          onLoad={setRows}
          onLoadWorkbook={(wb) => {
            setWorkbook(wb)
            setSheetNames(wb.SheetNames)
            setSelectedSheet(wb.SheetNames[0] ?? '')
          }}
        />
        <p>読み込み件数：{rows.length}</p>
      </Section>

    <Section title="STEP 2｜用途選択">
      <div className="mode-select">
        <button
          className={`mode-button ${mode === 'order' ? 'is-active' : ''}`}
          onClick={() => setMode('order')}
        >
          <div className="mode-icon">📄</div>
          <div className="mode-title">注文書・注文請書</div>
          
        </button>

        <button
          className={`mode-button ${mode === 'invoice' ? 'is-active' : ''}`}
          onClick={() => {
            setMode('invoice')
            setSettings(prev => ({
              ...prev,
              documentType: 'invoice',
              title: '請求書',
            }))
          }}
        >
          <div className="mode-icon">🧾</div>
          <div className="mode-title">請求書</div>
          
        </button>
      </div>
    </Section>

      {rows.length > 0 && mode === 'order' && (
        <Section title="STEP 3｜要員選択（注文書・注文請書）">
          <select
            style={styles.select}
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
          >
            <option value="">選択してください</option>
            {memberNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Section>
      )}

          {/* 請求先セレクト */}
          
  {rows.length > 0 && mode === 'invoice' && (
    <Section title="STEP 3｜請求先・要員選択（請求書）">

{mode === 'invoice' && workbook && (
  <div style={{ marginBottom: 12 }}>
    <label>📄 参照するシート：</label>
    <select
      value={selectedSheet}
      onChange={(e) => {
        const name = e.target.value
        setSelectedSheet(name)

        const sheet = workbook.Sheets[name]
        const json = XLSX.utils.sheet_to_json<WorkRow>(sheet)
        setRows(json)
      }}
    >
      {sheetNames.map(name => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  </div>
)}
      {/* 要員選択(全選択付き) */}
      <select
        style={styles.select}
        value={selectedClient}
        onChange={(e) => {
          const client = e.target.value
          setSelectedClient(client)

          // 👇 その請求先の要員を全員チェック状態にする
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

    {/* ✅ 全選択 / 全解除 */}
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
        

    {/* ✅ 要員チェックボックス */}
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
)}
          

      {mode === 'order' && selectedRow && (
        <Section title="STEP 4｜帳票出力（注文系）">

            <TemplateSettings
              settings={settings}
              setSettings={setSettings}
              mode={mode}
            />
            
            <div className="output-grid">
              <OutputCard
                title="注文書"
                icon="📄"
                onExcel={() => exportOrderExcel(selectedRow, settings)}
                onPdf={() => exportOrderPdf(selectedRow, settings)}
              />

              <OutputCard
                title="注文請書"
                icon="📑"
                onExcel={() =>
                  exportOrderConfirmationExcel(selectedRow, settings)
                }
                onPdf={() =>
                  exportOrderConfirmationPdf(selectedRow, settings)
                }
              />
              </div>
        </Section>
      )}


              {mode === 'invoice' && selectedInvoiceRows.length > 0 && (
                <Section title="STEP 4｜帳票出力（請求書）">
                  <TemplateSettings
                    settings={settings}
                    setSettings={setSettings}
                    mode={mode}
                  />
                  <OutputCard
                    title="請求書"
                    icon="🧾"
                    onExcel={async () => {
                      await exportInvoiceExcel(selectedInvoiceRows, settings)
                    }}
                    onPdf={() =>
                      exportInvoicePdf(selectedInvoiceRows, settings)
                    }
                  />
                </Section>
              )}
    </div>
  </div>
  )
}
export default App