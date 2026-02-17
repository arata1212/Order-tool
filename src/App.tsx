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
  // const [invoiceRows, setInvoiceRows] = useState<WorkRow[]>([])

  const [selectedName, setSelectedName] = useState('')
  // const [selectedInvoiceName, setSelectedInvoiceName] = useState('')

  const { settings, setSettings } = useTemplateSettings()

  // 要員名一覧
  const memberNames = Array.from(
    new Set(rows.map(row => row.要員名))
  )

  // 選択された要員の一行
  const selectedRow = rows.find(
    row => row.要員名 === selectedName
  )

  if (selectedRow) {
    console.log('選択された行', selectedRow)
  }

  // const invoiceNames = Array.from(
  //   new Set(invoiceRows.map(row => row.要員名))
  // )

  // const selectedInvoiceRow = invoiceRows.find(
  //   row => row.要員名 === selectedInvoiceName
  // )

  
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

      {/* <Section title="STEP 1｜請求書用 稼働表アップロード">
        <ExcelUploader onLoad={setInvoiceRows} />
      </Section> */}

      {rows.length > 0 && (
        <Section title="STEP 2｜要員選択">
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

          {/* <select
            value={selectedInvoiceName}
            onChange={(e) => setSelectedInvoiceName(e.target.value)}
          >
            <option value="">請求書用 要員を選択</option>
            {invoiceNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select> */}


        </Section>
        
      )}

      {selectedRow && (
        <>
          <Section title="STEP 3｜帳票出力">

            <TemplateSettings
              settings={settings}
              setSettings={setSettings}
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
                  exportOrderConfirmationExcel(selectedRow)
                }
                onPdf={() =>
                  exportOrderConfirmationPdf(selectedRow)
                }
              />

              <OutputCard
                title="請求書"
                icon="🧾"
                onExcel={() =>
                  exportInvoiceExcel(selectedRow, settings)
                }
                onPdf={() =>
                  exportInvoicePdf(selectedRow, settings)
                }
              />

            </div>

          </Section>
        </>
      )}
    </div>
  </div>
)
}

export default App
