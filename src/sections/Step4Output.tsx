import Section from '../layout/Section'
import OutputCard from '../layout/OutputCard'
import { TemplateSettings } from '../components/template/TemplateSettings'
import type { WorkRow } from '../types/workRow'
import type { TemplateSettingsType } from '../types/template'

import { exportOrderExcel } from '../utils/exportOrderExcel'
import { exportOrderPdf } from '../utils/exportOrderPdf'
import { exportOrderConfirmationExcel } from '../utils/exportOrderConfirmationExcel'
import { exportOrderConfirmationPdf } from '../utils/exportOrderConfirmationPdf'
import { exportInvoiceExcel } from '../utils/exportInvoiceExcel'
import { exportInvoicePdf } from '../utils/exportInvoicePdf'

type Mode = 'order' | 'invoice'

type Props = {
  mode: Mode
  selectedRow?: WorkRow
  selectedInvoiceRows: WorkRow[]
  settings: TemplateSettingsType
  setSettings: React.Dispatch<React.SetStateAction<TemplateSettingsType>>
}

export const Step4Output = ({
  mode,
  selectedRow,
  selectedInvoiceRows,
  settings,
  setSettings,
}: Props) => {
  if (mode === 'order' && !selectedRow) return null
  if (mode === 'invoice' && selectedInvoiceRows.length === 0) return null

  return (
    <Section title="STEP 4｜帳票出力">
      <TemplateSettings
        settings={settings}
        setSettings={setSettings}
        mode={mode}
      />

      {mode === 'order' && selectedRow && (
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
            onExcel={() => exportOrderConfirmationExcel(selectedRow, settings)}
            onPdf={() => exportOrderConfirmationPdf(selectedRow, settings)}
          />
        </div>
      )}

      {mode === 'invoice' && (
        <OutputCard
          title="請求書"
          icon="🧾"
          onExcel={() => exportInvoiceExcel(selectedInvoiceRows, settings)}
          onPdf={() => exportInvoicePdf(selectedInvoiceRows, settings)}
        />
      )}
    </Section>
  )
}