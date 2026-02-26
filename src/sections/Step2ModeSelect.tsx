import Section from '../layout/Section'

type Mode = 'order' | 'invoice'

type Props = {
  mode: Mode
  setMode: (m: Mode) => void
  onInvoiceSelect: () => void
}

export const Step2ModeSelect = ({ mode, setMode, onInvoiceSelect }: Props) => {
  return (
    <Section title="STEP 2｜用途選択">
      <div className="mode-select">
        <button
          className={`mode-button ${mode === 'order' ? 'is-active' : ''}`}
          onClick={() => setMode('order')}
        >
          📄 注文書・注文請書
        </button>

        <button
          className={`mode-button ${mode === 'invoice' ? 'is-active' : ''}`}
          onClick={() => {
            setMode('invoice')
            onInvoiceSelect()
          }}
        >
          🧾 請求書
        </button>
      </div>
    </Section>
  )
}