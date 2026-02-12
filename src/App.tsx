import { useState } from 'react'
import ExcelUploader from './components/ExcelUploader'
import type { WorkRow } from './types/workRow'
import { exportOrderExcel } from './utils/exportOrderExcel'
import { exportOrderPdf } from './utils/exportOrderPdf'
import { exportOrderConfirmationExcel } from './utils/exportOrderConfirmationExcel'
import { exportOrderConfirmationPdf } from './utils/exportOrderConfirmationPdf'
import Section from './layout/Section'
import OutputCard from './layout/OutputCard'
import { styles } from './styles/appStyles'
import './styles/App.css'

function App() {
  const [rows, setRows] = useState<WorkRow[]>([])
  const [selectedName, setSelectedName] = useState('')

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

  
  return (
  <div style={styles.page}>
    <header style={styles.header}>
      <h4>📄 注文書発行システム</h4>
    </header>

    <div style={styles.container}>

      <Section title="STEP 1｜Excelアップロード">
        <ExcelUploader onLoad={setRows} />
        <p>読み込み件数：{rows.length}</p>
      </Section>

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
        </Section>
      )}

      {selectedRow && (
        <>
          <Section title="帳票出力">
            <div className="output-grid">
              <OutputCard
                title="注文書"
                icon="📄"
                onExcel={() => exportOrderExcel(selectedRow)}
                onPdf={() => exportOrderPdf(selectedRow)}
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
            </div>

          </Section>
        </>
      )}
    </div>
  </div>
)
}

export default App
