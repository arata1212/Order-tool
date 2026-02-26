import Section from '../layout/Section'
import { styles } from '../styles/appStyles'

type Props = {
  memberNames: string[]
  selectedName: string
  onChange: (name: string) => void
}

export const Step3OrderSelect = ({ memberNames, selectedName, onChange }: Props) => {
  return (
    <Section title="STEP 3｜要員選択（注文書・注文請書）">
      <select
        style={styles.select}
        value={selectedName}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">選択してください</option>
        {memberNames.map(name => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </Section>
  )
}