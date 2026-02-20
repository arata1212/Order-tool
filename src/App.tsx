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
import './styles/App.css'
import { TemplateSettings } from './components/template/TemplateSettings'
import { useTemplateSettings } from './hooks/useTemplateSettings'

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
  const selectedRowLog = rows.find(
    row => row.要員名 === selectedName
  )

  if (selectedRowLog) {
    console.log('選択された行', selectedRowLog)
  }

  const billingClients = Array.from(
  new Set(rows.map(row => row.請求先名))
)

const invoiceMembers = rows.filter(
  row => row.請求先名 === selectedClient
)

  type Mode = 'order' | 'invoice'

const [mode, setMode] = useState<Mode>('order')



//出力部分
const selectedRow = rows.find(row => row.要員名 === selectedName)

const selectedInvoiceRows = rows.filter(row =>
  selectedInvoiceMembers.includes(row.要員名)
)



  return (
  <div style={styles.page}>
    <header style={styles.header}>
      <h4>📄 注文書発行システム</h4>
    </header>

    <div style={styles.container}>

      <Section title="STEP 1｜稼働表アップロード">
        <ExcelUploader onLoad={setRows} />
        <p>読み込み件数：{rows.length}</p>
      </Section>

    <Section title="STEP 2｜用途選択">
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => setMode('order')}
          style={{
            padding: 8,
            background: mode === 'order' ? '#333' : '#eee',
            color: mode === 'order' ? '#fff' : '#000',
          }}
        >
          注文書・注文請書
        </button>

        <button
          onClick={() => {
            setMode('invoice')
            setSettings(prev => ({
              ...prev,
              documentType: 'invoice',
              title: '請求書',
          }))
        }}
          style={{
            padding: 8,
            background: mode === 'invoice' ? '#333' : '#eee',
            color: mode === 'invoice' ? '#fff' : '#000',
          }}
        >
          請求書
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

      <select
        style={styles.select}
        value={selectedClient}
        onChange={(e) => {
          setSelectedClient(e.target.value)
          setSelectedInvoiceMembers([])
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
                      for (const row of selectedInvoiceRows) {
                        await exportInvoiceExcel(row, settings)
                      }
                    }}
                    onPdf={() =>
                      selectedInvoiceRows.forEach(row => exportInvoicePdf(row, settings))
                    }
                  />
                </Section>
              )}
              </div>
    </div>
  )}
export default App