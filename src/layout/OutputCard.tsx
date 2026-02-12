import '../styles/OutputCard.css'

type Props = {
  title: string
  icon: string
  onExcel: () => void
  onPdf: () => void
}

export default function OutputCard({
  title,
  icon,
  onExcel,
  onPdf,
}: Props) {
  return (
    <div className="output-card">
      <h3 className="output-title">
        {icon} {title}
      </h3>

      <div className="button-group">
        <button
          className="output-button excel-button"
          onClick={onExcel}
        >
          📊 Excel
        </button>

        <button
          className="output-button pdf-button"
          onClick={onPdf}
        >
          📄 PDF
        </button>
      </div>
    </div>
  )
}
