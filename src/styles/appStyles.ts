export const styles = {
  page: {
    minHeight: '100vh',
  },
  header: {
  background: 'var(--header-bg)',
  width: '100%',
  height: 48,
  display: 'flex',
  alignItems: 'center',
  padding: '0 24px',
},
  container: {
    maxWidth: 1000,
    margin: '0 auto',
    padding: 24,
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
  card: {
    background: 'var(--card-bg)',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
}
