export const styles = {
  page: {
    background: '#f3f4f6',
    minHeight: '100vh',
  },
  header: {
  width: '1000%',
  height: 48,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
  background: '#d5f6f8',
  borderBottom: '1px solid #399b56',
},
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 24,
  },
  card: {
    background: 'white',
    padding: 24,
    marginBottom: 24,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  select: {
    padding: 10,
    fontSize: 16,
    width: 300,
  },
  outputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
  },
  outputCard: {
    background: '#fafafa',
    padding: 20,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
  },
  buttonGroup: {
    display: 'flex',
    gap: 12,
    marginTop: 12,
  },
  excelBtn: {
    background: '#059669',
    color: 'white',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  pdfBtn: {
    background: '#dc2626',
    color: 'white',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
}
