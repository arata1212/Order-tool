import { styles } from '../styles/appStyles'

type Props = {
  title: string
  children: React.ReactNode
}

export default function Section({ title, children }: Props) {
  return (
    <div style={styles.card}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
