import  type { TemplateSettingsType } from "../../types/template"

type Props = {
  settings: TemplateSettingsType
  setSettings: React.Dispatch<React.SetStateAction<TemplateSettingsType>>
}

export const TemplateSettings = ({ settings, setSettings }: Props) => {
  const handleChange = (
    key: keyof TemplateSettingsType,
    value: string
  ) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  return (
    <div className="template-card">
      <h3>帳票設定</h3>

      {/* ▼ 帳票種別（選択式） */}
      <select
        value={settings.documentType}
        onChange={(e) => {
          const type = e.target.value as TemplateSettingsType['documentType']

          setSettings({
            ...settings,
            documentType: type,
            title:
              type === 'order'
                ? '注文書'
                : type === 'orderConfirmation'
                ? '注文請書'
                : '請求書',
          })
        }}
      >
        <option value="order">注文書</option>
        <option value="orderConfirmation">注文請書</option>
        <option value="invoice">請求書</option>
      </select>

      {/* ▼ タイトル（共通） */}
      <input
        value={settings.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="タイトル"
      />

      {/* ▼ 注文請書以外のときだけ表示 */}
      {settings.documentType !== 'orderConfirmation' && (
        <>
          <input
            value={settings.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            placeholder="会社名"
          />

          <input
            value={settings.postCode}
            onChange={(e) => handleChange("postCode", e.target.value)}
            placeholder="郵便番号"
          />

          <input
            value={settings.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="住所"
          />

          <input
            value={settings.building}
            onChange={(e) => handleChange("building", e.target.value)}
            placeholder="建物名"
          />

          <input
            value={settings.tel}
            onChange={(e) => handleChange("tel", e.target.value)}
            placeholder="電話番号"
          />

          <input
            value={settings.inchage}
            onChange={(e) => handleChange("inchage", e.target.value)}
            placeholder="担当"
          />
        </>
      )}
    </div>
  )
}
